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

    /**
     * 좋아요 테이블은 분리하면서 발생한 read 이슈
     * 테이블을 조회할 때마다 좋아요에 대한 count query가 발생한다.
     * post에 좋아요가 늘어날 수록 조회시에 부하가 증가한다.
     * 좋아요는 과연 높은 정합성을 요구할까 ? (좋아요 수가 딜레이를 가진다고 해서 고객에게 큰 이슈가 아니다.)
     * 배치파일을 통해 일정 주기마다 게시물에 대한 좋아요를 업데이트 함으로써, 부하를 줄일 수 있다. (조회할 때마다 count query를 날릴 필요 없음)
     * 고객이 좋아요를 눌렀을 때 고객이 현재 보이는 count 수에서 1을 바로 올려주면 즉시 적용되는 것처럼 보인다.
     */
    public PageCursor<PostDto> executeByTimeline(Long memberId, CursorRequest cursorRequest) {
        var pagedTimelines = timelineReadService.getTimelines(memberId, cursorRequest);
        var postIds = pagedTimelines.body().stream().map(Timeline::getPostId).toList();
        var posts = postReadService.getPostDtos(postIds);
        return new PageCursor<>(pagedTimelines.nextCursorRequest(), posts);
    }
}
