package com.voting.votingapk.services;

import com.voting.votingapk.model.OptionVote;
import com.voting.votingapk.model.Poll;
import com.voting.votingapk.repositories.PollRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PollService {

    private final PollRepository pollRepository;

    public PollService(PollRepository pollRepository) {
        this.pollRepository = pollRepository;
    }

    public Poll createPoll(Poll poll) {
        return pollRepository.save(poll);
    }

    public List<Poll> getAllPolls() {
        return pollRepository.findAll();
    }

    public Optional<Poll> getPollById(Long id) {
        return pollRepository.findById(id);
    }

    public void vote(Long pollId, int optionIndex) {
        // Get the poll obj from DB
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(()-> new RuntimeException("Poll not found"));
        // Get all options if index not valid throw error
        List<OptionVote> options = poll.getOptions();
        if(optionIndex < 0 || optionIndex >= options.size()){
            throw new IllegalArgumentException("Invalid option index");
        }
        // Get Option selected
        OptionVote selectedOption = options.get(optionIndex);
        // increment vote for selected option
        selectedOption.setVoteCount(selectedOption.getVoteCount() + 1);

        pollRepository.save(poll);

    }
}
