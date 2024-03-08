package io.dustin.apps.application.usacase;

import io.dustin.apps.domain.follow.entity.Follow;
import io.dustin.apps.domain.follow.service.FollowReadService;
import io.dustin.apps.domain.post.dto.PostCommand;
import io.dustin.apps.domain.post.service.PostWriteService;
import io.dustin.apps.domain.post.service.TimelineWriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class CreatePostUsecase {
    final private PostWriteService postWriteService;
    final private FollowReadService followReadService;
    final private TimelineWriteService timelineWriteService;

    // create -> error 발생 -> deliveryToTimeLine의 insert 실행되지 못함 -> create 롤백
    @Transactional
    public Long execute(PostCommand command) {
        /**
         * 이 usecase에 @Transactional 어노테이션을 설정하는 것은 트래픽이 늘어났을 때, 고민해야 할 사항임
         * 1. 게시물을 작성할때 TimeLine 테이블을 생성한다.
         * 2. 팔로워가 늘어나면 트랙잰션이 비용이 커질 수 밖에 없음(undo log 유지 시간이 길어짐)
         * 3. 트랜잭션은 최대한 좁은 범위로 가져가자. 트랜잭션이 처리가 길어질수록 커넥션풀 점유시간이 길어진다.
         */
        var postId = postWriteService.create(command);
        // 의도적으로 에러 발생 시킴
        // var error = 0 / 0;

        /**
         * 게시물을 작성하면 timeline 테이블을 추가로 생성허기 때문에 write시 부하가 증가했다. (read는 감소)
         * 만약 s3에서 사진업로드 같은 기능이 추가된다면 외부요인에 의해 Transactional 시간이 더 길어질 수가 있다.
         * 팔로워 유저를 가져와 타임라인 테이블을 만드는 구간을 캐싱하거나 비동기로 처리하는 것도 방법이다.
         */
        var followerMemberIds = followReadService
                .getFollowers(command.memberId()).stream()
                .map((Follow::getFromMemberId))
                .toList();

        timelineWriteService.deliveryToTimeLine(postId, followerMemberIds);

        return postId;
    }

    /**
     * @Transactional을 inner 함수에 설정하면 정상 작동하지 않음
     */
    @Transactional
    Long getErrorMethod(PostCommand command){
        var postId = postWriteService.create(command);
        // 의도적으로 에러 발생 시킴
        var error = 0 / 0;
        var followerMemberIds = followReadService
                .getFollowers(command.memberId()).stream()
                .map((Follow::getFromMemberId))
                .toList();

        timelineWriteService.deliveryToTimeLine(postId, followerMemberIds);

        return postId;
    };
    public Long errorExecute(PostCommand command) {
        /**
         * errorExecute 함수는 inner 함수 errorExecute 호출
         * create 실행 -> 에러발생 -> deliveryToTimeLine의 insert 실행되지 못함
         * create가 롤백되지 않고 저장됨
         */
        return getErrorMethod(command);


    }

}
