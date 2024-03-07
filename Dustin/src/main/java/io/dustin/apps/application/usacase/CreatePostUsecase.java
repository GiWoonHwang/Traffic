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
        var postId = postWriteService.create(command);
        // 의도적으로 에러 발생 시킴
        var error = 0 / 0;
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
