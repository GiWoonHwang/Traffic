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


    @Transactional
    public void likePost(Long postId) {
        var post = postRepository.findById(postId, true).orElseThrow();
        post.incrementLikeCount();
        postRepository.save(post);
    }

    public void likePostByOptimisticLock(Long postId) {
        var post = postRepository.findById(postId, false).orElseThrow();
        post.incrementLikeCount();
        postRepository.save(post);
    }
}
