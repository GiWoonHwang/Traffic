package io.dustin.apps.domain.post.service;

import io.dustin.apps.domain.post.entity.Post;
import io.dustin.apps.domain.post.repository.PostRepository;
import io.dustin.apps.domain.post.dto.PostCommand;
import io.dustin.apps.domain.post.repository.TimelineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class PostWriteService {
    final private PostRepository postRepository;

    public Long create(PostCommand command) {
        var post = Post
                .builder()
                .memberId(command.memberId())
                .contents(command.contents())
                .build();

        return postRepository.save(post).getId();
    }


    /**
     * 비관적 락(줄세우기)를 통한 좋아요 구현
     */
    @Transactional
    public void likePost(Long postId) {
        var post = postRepository.findById(postId, true).orElseThrow();
        post.incrementLikeCount();
        postRepository.save(post);
    }

    /**
     * 두개 이상의 동시 요청이 발생되면 좋아요가 덮어씌워진다.
     * tx1: read(like:1) -> like update(liek:2) -> save -> commit
     * tx2: tx가 커밋되기 전에 실행:  read(like:1) -> like update(liek:2) -> save -> commit
     * 결과적으로 좋아요를 두번 요청했지만  3 아닌 2로 업데이트 된다.
     */
    public void likePostError(Long postId) {
        var post = postRepository.findById(postId, false).orElseThrow();
        post.incrementLikeCount();
        postRepository.save(post);
    }

    public void likePostByOptimisticLock(Long postId) {
        var post = postRepository.findById(postId, false).orElseThrow();
        post.incrementLikeCount();
        postRepository.save(post);
    }
}
