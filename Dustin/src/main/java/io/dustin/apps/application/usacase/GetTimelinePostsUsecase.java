package io.dustin.apps.application.usacase;

import io.dustin.apps.domain.follow.entity.Follow;
import io.dustin.apps.domain.follow.service.FollowReadService;
import io.dustin.apps.domain.post.dto.PostDto;
import io.dustin.apps.domain.post.entity.Timeline;
import io.dustin.apps.domain.post.service.PostReadService;
import io.dustin.apps.domain.post.service.TimelineReadService;
import io.dustin.apps.util.CursorRequest;
import io.dustin.apps.util.PageCursor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@RequiredArgsConstructor
@Service
public class GetTimelinePostsUsecase {
    final private FollowReadService followReadService;

    final private PostReadService postReadService;

    final private TimelineReadService timelineReadService;

    public PageCursor<PostDto> execute(Long memberId, CursorRequest cursorRequest) {
        var follows = followReadService.getFollowings(memberId);
        var followerMemberIds = follows
                .stream()
                .map(Follow::getToMemberId)
                .toList();

        return postReadService.getPostDtos(followerMemberIds, cursorRequest);
    }

    public PageCursor<PostDto> executeByTimeline(Long memberId, CursorRequest cursorRequest) {
        var pagedTimelines = timelineReadService.getTimelines(memberId, cursorRequest);
        var postIds = pagedTimelines.body().stream().map(Timeline::getPostId).toList();
        var posts = postReadService.getPostDtos(postIds);
        return new PageCursor<>(pagedTimelines.nextCursorRequest(), posts);
    }
}
