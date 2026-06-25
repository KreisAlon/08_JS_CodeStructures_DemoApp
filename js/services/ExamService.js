import { Exam } from "../models/Exam.js";
import { Question } from "../models/Question.js";

export class ExamService {
    constructor() {
        this.storageKey = "exams";
    }

    getAllExams() {
        // Get the exams data from localStorage
        const data = localStorage.getItem(this.storageKey);

        if (!data) {
            return [];
        }

        // continue if key exists, parse the JSON data and create Exam and Question instances
        const plainExams = JSON.parse(data);

        // for each examData(Exam), return new Exam object with the same properties,
        // and for each questionData(Question) in examData.questions,
        // return new Question object with the same properties

        // clone the data to new objects to avoid direct manipulation of the data stored in localStorage.
        let allExamsClones = plainExams.map(examData => {
            const exam = new Exam(examData.title);

            exam.id = examData.id;
            exam.createdAt = examData.createdAt;
            // Inner Clone for Questions
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
    // Save to Local Storage (handles both new and updated exams)
    saveExam(exam) {
        const exams = this.getAllExams();
        // Find if the exam already exists in the system by its ID
        const existingExamIndex = exams.findIndex(e => e.id === exam.id);

        if (existingExamIndex >= 0) {
            // If it exists, overwrite (update) it
            exams[existingExamIndex] = exam;
        } else {
            // If it does not exist, add it as a new exam
            exams.push(exam);
        }

        // Save the updated list back to localStorage
        localStorage.setItem(this.storageKey, JSON.stringify(exams));
    }

    deleteExam(examId) {
        const exams = this.getAllExams();

        const filteredExams = exams.filter(exam => exam.id !== examId);

        localStorage.setItem(this.storageKey, JSON.stringify(filteredExams));
    }

    getExamById(examId) {
        const exams = this.getAllExams();

        return exams.find(exam => String(exam.id) === String(examId));
    }

    clearAllExams() {
        localStorage.removeItem(this.storageKey);
    }
}