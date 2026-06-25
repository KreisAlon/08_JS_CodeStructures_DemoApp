export class Exam {
    constructor(title) {
        // Generate a unique ID using the current time in milliseconds (safe for all environments)
        this.id = Date.now().toString();

        // Set the exam title
        this.title = title;

        // Initialize an empty array to store the questions
        this.questions = [];

        // Save the current date and time as the creation date
        this.createdAt = new Date().toISOString();
    }

    // Add a new question object to the exam's questions array
    addQuestion(question) {
        this.questions.push(question);
    }

    // Return the total number of questions currently in the exam
    getQuestionCount() {
        return this.questions.length;
    }
}