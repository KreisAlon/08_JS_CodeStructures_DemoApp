export class Question {
    constructor(text, answers, correctAnswerIndex) {
        // Generate a unique ID using time and a random string (safe for local testing)
        this.id = Date.now().toString() + Math.random().toString(36).substr(2, 9);

        // Use exactly 'text' for the question content
        this.text = text;

        this.answers = answers;
        this.correctAnswerIndex = correctAnswerIndex;
    }

    isCorrect(userAnswerIndex) {
        return userAnswerIndex === this.correctAnswerIndex;
    }
}