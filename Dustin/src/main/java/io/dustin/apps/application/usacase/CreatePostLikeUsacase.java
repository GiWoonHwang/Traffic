package io.dustin.apps.application.usacase;

import io.dustin.apps.domain.member.service.MemberReadService;
import io.dustin.apps.domain.post.service.PostLikeWriteService;
import io.dustin.apps.domain.post.service.PostReadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class CreatePostLikeUsacase {
    final private PostReadService postReadService;
    final private MemberReadService memberReadService;
    final private PostLikeWriteService postLikeWriteService;

    /**
     * 좋아요 테이블은 분리함으로서 post의 write 성능이 개선됨
     * post에 대한 락을 설정할 필요가 없다.
     * 좋아요 테이블에 insert만 발생하기 때문에 하나의 자원에 대한 경합이 발생되지 않는다.
     */
    public void execute(Long postId, Long memberId) {
        var post = postReadService.getPost(postId);
        var member = memberReadService.getMember(memberId);
        postLikeWriteService.create(post, member);
    }
}
