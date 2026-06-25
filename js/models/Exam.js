export class Exam {
    constructor(title, description = "", category = "", examCode = "", timeLimit = 0) {
        // Generate a unique ID using the current time and a random string
        this.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);

        // Basic exam details
        this.title = title;
        this.description = description;
        this.category = category;
        this.examCode = examCode;
        this.timeLimit = timeLimit; // Time limit in minutes

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