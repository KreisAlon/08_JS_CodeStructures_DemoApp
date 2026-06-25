import { ExamService } from "./services/ExamService.js";

const examService = new ExamService();

// Get exam ID from URL parameters
const urlParams = new URLSearchParams(window.location.search);
const examId = urlParams.get("id");

// DOM Elements
const editExamTitle = document.getElementById("editExamTitle");
const editQuestionsList = document.getElementById("editQuestionsList");
const saveChangesBtn = document.getElementById("saveChangesBtn");
const editMessage = document.getElementById("editMessage");
const addNewQuestionBtn = document.getElementById("addNewQuestionBtn"); // הוספת המשתנה לכפתור החדש

// Fetch the exam object
const currentExam = examService.getExamById(examId);

if (!currentExam) {
    editMessage.innerHTML = `<div class="alert alert-danger">Exam not found!</div>`;
} else {
    // Populate the exam title
    editExamTitle.value = currentExam.title;
    // Render the editable questions
    renderQuestions();
}

// Function to render all questions as editable form fields
function renderQuestions() {
    editQuestionsList.innerHTML = `<h5 class="mb-3">Edit Questions:</h5>`;

    if (currentExam.questions.length === 0) {
        editQuestionsList.innerHTML += `<p class="text-danger">This exam has no questions left.</p>`;
        return;
    }

    // Loop through questions and create input fields for each
    currentExam.questions.forEach((q, index) => {
        editQuestionsList.innerHTML += `
            <div class="card mb-4 p-3 bg-white shadow-sm border">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h6 class="mb-0 fw-bold">Question ${index + 1}</h6>
                    <button class="btn btn-sm btn-danger remove-q-btn" data-index="${index}">Delete Question</button>
                </div>
                
                <div class="mb-3">
                    <label class="form-label text-muted small">Question Text</label>
                    <input type="text" id="q-text-${index}" class="form-control" value="${q.text}"> 
                </div>
                
                <div class="row">
                    <div class="col-md-6 mb-2">
                        <label class="form-label text-muted small">Answer 1</label>
                        <input type="text" id="q-ans0-${index}" class="form-control form-control-sm" value="${q.answers[0]}">
                    </div>
                    <div class="col-md-6 mb-2">
                        <label class="form-label text-muted small">Answer 2</label>
                        <input type="text" id="q-ans1-${index}" class="form-control form-control-sm" value="${q.answers[1]}">
                    </div>
                    <div class="col-md-6 mb-2">
                        <label class="form-label text-muted small">Answer 3</label>
                        <input type="text" id="q-ans2-${index}" class="form-control form-control-sm" value="${q.answers[2]}">
                    </div>
                    <div class="col-md-6 mb-2">
                        <label class="form-label text-muted small">Answer 4</label>
                        <input type="text" id="q-ans3-${index}" class="form-control form-control-sm" value="${q.answers[3]}">
                    </div>
                </div>
                
                <div class="mb-2 mt-2">
                    <label class="form-label text-muted small fw-bold">Correct Answer Number (1-4)</label>
                    <input type="number" id="q-correct-${index}" class="form-control form-control-sm w-50" min="1" max="4" value="${q.correctAnswerIndex + 1}">
                </div>
            </div>
        `;
    });

    // Add event listeners to all delete buttons
    document.querySelectorAll(".remove-q-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const indexToRemove = e.target.getAttribute("data-index");
            currentExam.questions.splice(indexToRemove, 1);
            // Re-render the list after deletion
            renderQuestions();
        });
    });
}

// Handle Add New Question button click
if (addNewQuestionBtn) {
    addNewQuestionBtn.addEventListener("click", () => {
        currentExam.questions.push({
            text: "",
            answers: ["", "", "", ""],
            correctAnswerIndex: 0
        });
        renderQuestions();
    });
}

// Handle save button click
saveChangesBtn.addEventListener("click", () => {
    const newTitle = editExamTitle.value.trim();

    if (!newTitle) {
        editMessage.innerHTML = `<div class="alert alert-danger">Title cannot be empty.</div>`;
        return;
    }

    // Update the exam title
    currentExam.title = newTitle;

    // Loop through all questions to save their updated values from the inputs
    for (let i = 0; i < currentExam.questions.length; i++) {
        const qText = document.getElementById(`q-text-${i}`).value.trim();
        const ans0 = document.getElementById(`q-ans0-${i}`).value.trim();
        const ans1 = document.getElementById(`q-ans1-${i}`).value.trim();
        const ans2 = document.getElementById(`q-ans2-${i}`).value.trim();
        const ans3 = document.getElementById(`q-ans3-${i}`).value.trim();
        const correctNum = parseInt(document.getElementById(`q-correct-${i}`).value);

        // Validation for each question
        if (!qText || !ans0 || !ans1 || !ans2 || !ans3) {
            editMessage.innerHTML = `<div class="alert alert-danger">Please fill all fields for Question ${i + 1}.</div>`;
            return;
        }

        if (correctNum < 1 || correctNum > 4) {
            editMessage.innerHTML = `<div class="alert alert-danger">Correct answer for Question ${i + 1} must be between 1 and 4.</div>`;
            return;
        }

        // Apply changes to the question object
        currentExam.questions[i].text = qText; // שינוי ל-text
        currentExam.questions[i].answers = [ans0, ans1, ans2, ans3];
        currentExam.questions[i].correctAnswerIndex = correctNum - 1; // Convert 1-4 back to 0-3 index
    }

    // Save the updated exam back to local storage
    examService.saveExam(currentExam);

    editMessage.innerHTML = `<div class="alert alert-success">Exam updated successfully! Redirecting...</div>`;

    // Immediate redirect
    window.location.href = "teacher.html";
});