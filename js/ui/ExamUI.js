export class ExamUI {
  constructor(examService) {
    // Get Service for CRUD operations on Exams
    this.examService = examService;
    // Get References to UI Elements
    this.examListElement = document.getElementById("examList");
    this.examRunnerElement = document.getElementById("examRunner");
    this.builderMessageElement = document.getElementById("builderMessage");
  }

  showBuilderMessage(message, type = "success") {
    this.builderMessageElement.innerHTML = `
      <div class="alert alert-${type}">
        ${message}
      </div>
    `;
  }

  clearBuilderMessage() {
    this.builderMessageElement.innerHTML = "";
  }

  // Render Exam List (JS OBJECTS) and display them in the UI
  renderExamList() {
    const exams = this.examService.getAllExams();

    this.examListElement.innerHTML = "";

    if (exams.length === 0) {
      this.examListElement.innerHTML = `
        <p class="text-muted">No exams saved yet.</p>
      `;
      return;
    }

    // For each exam create div and add it to The html
    exams.forEach(exam => {
      const div = document.createElement("div");
      div.className = "exam-card";

      div.innerHTML = `
        <h5>${exam.title}</h5>

        <p class="small-muted">
          Questions: ${exam.getQuestionCount()}
        </p>

        <p class="small-muted">
          Created: ${new Date(exam.createdAt).toLocaleString()}
        </p>

        <button
          class="btn btn-sm btn-success run-btn"
          data-id="${exam.id}">
          Run Exam
        </button>

        <a href="edit-exam.html?id=${exam.id}" class="btn btn-sm btn-warning mx-1">
          Edit
        </a>
        
        <button
          class="btn btn-sm btn-danger delete-btn"
          data-id="${exam.id}">
          Delete
        </button>
      `;

      this.examListElement.appendChild(div);
    });
  }

  renderExamRunner(exam) {
    // Check if the exam object exists
    if (!exam) {
      this.examRunnerElement.innerHTML = `
        <div class="alert alert-danger">
          Exam not found.
        </div>
      `;
      return;
    }

    // Check if the exam has any questions
    if (!exam.questions || exam.questions.length === 0) {
      this.examRunnerElement.innerHTML = `
        <div class="alert alert-warning">
          This exam has no questions.
        </div>
      `;
      return;
    }

    // Clear the container and render the main exam card
    this.examRunnerElement.innerHTML = `
      <div class="card p-4 shadow-sm mt-4 border-primary">
          <h4 class="text-primary fw-bold mb-2">${exam.title}</h4>
          <p class="text-muted border-bottom pb-3 mb-4">
            Answer all questions and submit the exam.
          </p>
          <div id="questionsContainer"></div>
      </div>
    `;

    const questionsContainer = this.examRunnerElement.querySelector("#questionsContainer");

    // Loop through each question and render it
    exam.questions.forEach((question, questionIndex) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "question-box bg-light border-0 mb-4 p-3 rounded";

      // Safely extract the question text (supports backward compatibility)
      const textToShow = question.questionText || question.text;

      // Render the question text and its multiple-choice answers
      questionDiv.innerHTML = `
        <h6 class="fw-bold mb-3">${questionIndex + 1}. ${textToShow}</h6>

        ${question.answers.map((answer, answerIndex) => `
          <label class="answer-label d-block mb-2 p-2 border rounded bg-white" style="cursor: pointer; transition: background 0.2s;">
            <input
              type="radio"
              class="me-2"
              name="question-${questionIndex}"
              value="${answerIndex}">
            ${answer}
          </label>
        `).join("")}
      `;

      questionsContainer.appendChild(questionDiv);
    });

    // Create and configure the submit button
    const submitButton = document.createElement("button");
    submitButton.className = "btn btn-primary btn-lg w-100 mt-2";
    submitButton.textContent = "Submit Exam";

    // Attach click event to grade the exam
    submitButton.addEventListener("click", () => {
      this.checkExam(exam);
    });

    // Append the submit button to the bottom of the main card
    this.examRunnerElement.querySelector(".card").appendChild(submitButton);
  }

  checkExam(exam) {
    let score = 0;

    exam.questions.forEach((question, questionIndex) => {
      const selectedAnswer = document.querySelector(
        `input[name="question-${questionIndex}"]:checked`
      );

      if (!selectedAnswer) {
        return;
      }

      const userAnswerIndex = Number(selectedAnswer.value);

      if (question.isCorrect(userAnswerIndex)) {
        score++;
      }
    });

    const resultDiv = document.createElement("div");
    resultDiv.className = "alert alert-info mt-3";

    resultDiv.innerHTML = `
      <h5>Exam Result</h5>
      <p>Score: ${score} / ${exam.questions.length}</p>
      <p>Percent: ${Math.round((score / exam.questions.length) * 100)}%</p>
    `;

    this.examRunnerElement.appendChild(resultDiv);
  }
}