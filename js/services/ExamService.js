import { Exam } from "../models/Exam.js";
import { Question } from "../models/Question.js";

export class ExamService {
    constructor() {
        this.storageKey = "exams";
    }

    getAllExams() {
        // Retrieve raw data from localStorage
        const data = localStorage.getItem(this.storageKey);

        if (!data) {
            return [];
        }

        // Parse the JSON string back into basic objects
        const plainExams = JSON.parse(data);

        // Reconstruct proper Exam and Question class instances
        let allExamsClones = plainExams.map(examData => {
            const exam = new Exam(examData.title);

            // Restore base properties
            exam.id = examData.id;
            exam.createdAt = examData.createdAt;

            // Restore extended details
            exam.description = examData.description;
            exam.category = examData.category;
            exam.examCode = examData.examCode;
            exam.timeLimit = examData.timeLimit;

            // Reconstruct the questions array with Question instances
            exam.questions = examData.questions.map(questionData => {
                const question = new Question(
                    questionData.text,
                    questionData.answers,
                    questionData.correctAnswerIndex
                );

                question.id = questionData.id;

                return question;
            });

            return exam;
        });

        return allExamsClones;
    }

    saveExam(exam) {
        const exams = this.getAllExams();
        const existingExamIndex = exams.findIndex(e => e.id === exam.id);

        if (existingExamIndex >= 0) {
            // Update existing exam
            exams[existingExamIndex] = exam;
        } else {
            // Add new exam
            exams.push(exam);
        }

        // Commit changes to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(exams));
    }

    deleteExam(examId) {
        const exams = this.getAllExams();
        const filteredExams = exams.filter(exam => exam.id !== examId);

        localStorage.setItem(this.storageKey, JSON.stringify(filteredExams));
    }

    getExamById(examId) {
        const exams = this.getAllExams();
        // Force string comparison to prevent type mismatch errors
        return exams.find(exam => String(exam.id) === String(examId));
    }

    clearAllExams() {
        localStorage.removeItem(this.storageKey);
    }
}