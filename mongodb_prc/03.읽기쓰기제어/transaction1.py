from pymongo import MongoClient
from pymongo.read_concern import ReadConcern
from pymongo.write_concern import WriteConcern
from pymongo.errors import ConnectionFailure, OperationFailure
import certifi

# 몽고디비는 트랜잭션을 추천하지 않는다.
# 몽고디비는 같은 오브젝트를 참조하면 에러를 발생시킨다. -> 복구에 대한 비용이 매우 크다
# 4.0 버전에서 직접 retry를 구현해본다.
conn = "mongodb+srv://mongodb_user:__PWD__@cluster0.v6fiw3s.mongodb.net/"
client = MongoClient(conn, tlsCAFile=certifi.where())

# client.test.orders.drop()
# client.test.inventory.drop()
# client.test.inventory.insert_one({"name": "pencil", "qty": 1000})

def update_orders_and_inventory(session):
	orders = session.client.test.orders
	inventory = session.client.test.inventory

	with session.start_transaction(read_concern=ReadConcern('majority'), write_concern=WriteConcern(w='majority')):
		order = 100
		orders.insert_one(
			{"name": "pencil", "qty": order}, 
			session=session
		)
		inventory.update_one(
			{
				"name": "pencil",
				"qty": {"$gte": order}
			},
			{
				"$inc": {"qty": order * -1}
			}
		)
		commit_with_retry(session)

def commit_with_retry(session):
	while True:
		try:
			session.commit_transaction()
			print("Transaction Commited.")
			print(session.client.test.orders.find_one({"name": "pencil"}))
			print(session.client.test.inventory.find_one({"name": "pencil"}))
			break
		except (ConnectionFailure, OperationFailure) as err:
			if err.has_error_label("UnknownTransactionCommitResult"):
				print("UnknownTransactionCommitResult, retrying commit operation...")
				continue
			else:
				print("Error during commit...")
				raise

def run_transaction_with_retry(transaction_func, session):
	while True:
		try:
			transaction_func(session)
			break
		except (ConnectionFailure, OperationFailure) as err:
			# retry가 필요한 오류가 발생한 경우 while문을 계속 진행한다.
			if err.has_error_label("TransientTransactionError"):
				print("TransientTransactionError, retryinh transaction...")
				continue
			else:
				raise

# 세션을 열고 트랜잭션 실행한다.
with client.start_session() as session:
	try:
		run_transaction_with_retry(update_orders_and_inventory, session)
	except:
		raise
