import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';
import { Poll } from '../poll.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poll',
  imports: [CommonModule, FormsModule],
  templateUrl: './poll.component.html',
  styleUrl: './poll.component.css',
})
export class PollComponent implements OnInit {
  newPoll: Poll = {
    // id: 0, as the id is auto-generated field, it is not necessary to include it in the model
    question: '',
    options: [
      { optionText: '', voteCount: 0 },
      { optionText: '', voteCount: 0 },
    ],
  };

  polls: Poll[] = [];

  constructor(private pollService: PollService) {}

  ngOnInit(): void {
    this.loadPoll();
  }

  loadPoll() {
    this.pollService.getPolls().subscribe({
      next: (data) => {
        this.polls = data;
      },
      error: (error) => {
        console.error('Error loading polls:', error);
      },
    });
  }

  addOption() {
    this.newPoll.options.push({ optionText: '', voteCount: 0 });
  }

  createPoll() {
    this.pollService.createPoll(this.newPoll).subscribe({
      next: (createPoll) => {
        this.polls.push(createPoll);
        this.resetpoll();
      },
      error: (error) => {
        console.error('Error creating poll:', error);
      },
    });
  }

  resetpoll() {
    this.newPoll = {
      question: '',
      options: [
        { optionText: '', voteCount: 0 },
        { optionText: '', voteCount: 0 },
      ],
    };
  }

  vote(pollId: number, optionIndex: number) {
    this.pollService.vote(pollId, optionIndex).subscribe({
      next: () => {
        // Update the vote count for the specific option in the poll
        const poll = this.polls.find((p) => p.id === pollId);
        if (poll && poll.options[optionIndex]) {
          poll.options[optionIndex].voteCount++;
        }
      },
      error: (error) => {
        console.error('Error voting on the Poll:', error);
      },
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
