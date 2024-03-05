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

    @Transactional
    public Long execute(PostCommand command) {
        var postId = postWriteService.create(command);

        var followerMemberIds = followReadService
                .getFollowers(command.memberId()).stream()
                .map((Follow::getFromMemberId))
                .toList();

        timelineWriteService.deliveryToTimeLine(postId, followerMemberIds);

        return postId;
    }

}
