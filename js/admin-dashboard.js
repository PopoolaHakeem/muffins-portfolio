// ========================================
// 1. IMPORT FIREBASE SERVICES
// ========================================

import {
    onAuthStateChanged,
    signOut
} from "firebase/auth";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";

import {
    auth,
    db
} from "./firebase-config.js";


// ========================================
// 2. ADMIN SETTINGS
// ========================================

// Use the SAME UID you placed in admin-login.js.
const ADMIN_UID = "NMtRjKWue2RzYsYmARRKMeuFtnC3";


// ========================================
// 3. GET HTML ELEMENTS
// ========================================

const projectForm = document.getElementById("projectForm");
const projectTitle = document.getElementById("projectTitle");
const projectLiveUrl = document.getElementById("projectLiveUrl");
const projectGithubUrl = document.getElementById("projectGithubUrl");
const projectImageUrl = document.getElementById("projectImageUrl");
const projectImageType = document.getElementById("projectImageType");
const imageInputHelp = document.getElementById("imageInputHelp");

const imagePreviewContainer = document.getElementById("imagePreviewContainer");
const projectImagePreview = document.getElementById("projectImagePreview");
const imagePreviewMessage = document.getElementById("imagePreviewMessage");
const projectTechnologies = document.getElementById("projectTechnologies");
const projectDescription = document.getElementById("projectDescription");
const projectFeatured = document.getElementById("projectFeatured");

const formHeading = document.getElementById("formHeading");
const formMessage = document.getElementById("formMessage");
const projectsMessage = document.getElementById("projectsMessage");

const saveProjectButton = document.getElementById("saveProjectButton");
const cancelEditButton = document.getElementById("cancelEditButton");
const logoutButton = document.getElementById("logoutButton");
const refreshProjectsButton = document.getElementById("refreshProjectsButton");

const adminProjectsList = document.getElementById("adminProjectsList");

const totalProjectsElement = document.getElementById("totalProjects");
const featuredProjectsElement = document.getElementById("featuredProjects");
const otherProjectsElement = document.getElementById("otherProjects");


// ========================================
// 4. DASHBOARD STATE
// ========================================

let editingProjectId = null;
let isAuthorizedAdmin = false;
let projectsCache = [];


// ========================================
// 5. DISPLAY MESSAGES
// ========================================

function showFormMessage(message, isError = false) {
    formMessage.textContent = message;
    formMessage.style.color = isError ? "#f87171" : "#a3e635";
}

function showProjectsMessage(message, isError = false) {
    projectsMessage.textContent = message;
    projectsMessage.style.color = isError ? "#f87171" : "#a3e635";
}


// ========================================
// 6. CHECK ADMIN AUTHENTICATION
// ========================================

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.replace("./admin-login.html");
        return;
    }

    if (user.uid !== ADMIN_UID) {
        isAuthorizedAdmin = false;

        await signOut(auth);

        window.location.replace("./admin-login.html");
        return;
    }

    isAuthorizedAdmin = true;

    await loadProjects();
});


// ========================================
// 7. LOAD PROJECTS FROM FIRESTORE
// ========================================

async function loadProjects() {
    if (!isAuthorizedAdmin) return;

    showProjectsMessage("Loading projects...");

    try {
        const projectsSnapshot = await getDocs(
            collection(db, "projects")
        );

        projectsCache = projectsSnapshot.docs.map((document) => ({
            id: document.id,
            ...document.data()
        }));

        renderProjects();
        updateStatistics();

        showProjectsMessage(
            projectsCache.length ?
            "" :
            "No projects found. Add your first project above."
        );

    } catch (error) {
        console.error("Could not load projects:", error.code);

        showProjectsMessage(
            "Could not load projects. Check your connection and Firestore rules.",
            true
        );
    }
}


// ========================================
// 8. UPDATE DASHBOARD STATISTICS
// ========================================

function updateStatistics() {
    const featuredCount = projectsCache.filter(
        (project) => project.featured === true
    ).length;

    totalProjectsElement.textContent = projectsCache.length;
    featuredProjectsElement.textContent = featuredCount;
    otherProjectsElement.textContent =
        projectsCache.length - featuredCount;
}


// ========================================
// 9. RENDER PROJECT CARDS
// ========================================

function renderProjects() {
    adminProjectsList.replaceChildren();

    if (projectsCache.length === 0) {
        const emptyMessage = document.createElement("div");

        emptyMessage.className = "empty-projects";
        emptyMessage.textContent =
            "Your project list is empty. Add a project using the form above.";

        adminProjectsList.appendChild(emptyMessage);

        return;
    }

    projectsCache.forEach((project) => {
        const card = document.createElement("article");
        card.className = "admin-project-card";

        // Project thumbnail

        const image = document.createElement("img");

        image.className = "admin-project-image";
        image.alt = `${project.title || "Project"} thumbnail`;
        image.loading = "lazy";

        image.src = project.imageUrl || project.image || "";

        image.addEventListener("error", () => {
            image.style.display = "none";
        });

        // Project content

        const content = document.createElement("div");
        content.className = "admin-project-content";

        const topline = document.createElement("div");
        topline.className = "admin-project-topline";

        const title = document.createElement("h3");
        title.textContent = project.title || "Untitled Project";

        const status = document.createElement("span");

        status.className = project.featured ?
            "project-status" :
            "project-status not-featured";

        status.textContent = project.featured ?
            "FEATURED" :
            "NOT FEATURED";

        topline.append(title, status);

        const description = document.createElement("p");

        description.className = "admin-project-description";
        description.textContent = project.description || "No description.";

        const technologies = document.createElement("p");

        technologies.className = "admin-project-technologies";

        const technologyList = Array.isArray(project.technologies) ?
            project.technologies.join(", ") :
            project.technologies || "Not specified";

        technologies.textContent = `Technologies: ${technologyList}`;

        // Project actions

        const actions = document.createElement("div");
        actions.className = "admin-project-actions";

        const liveLink = document.createElement("a");

        liveLink.href = project.liveUrl || "#";
        liveLink.target = "_blank";
        liveLink.rel = "noopener noreferrer";
        liveLink.textContent = "View Live ↗";

        if (!project.liveUrl) {
            liveLink.removeAttribute("target");
            liveLink.removeAttribute("rel");
        }

        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", () => {
            startEditingProject(project.id);
        });

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.className = "delete-project-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteProject(project.id, project.title);
        });

        actions.append(liveLink, editButton, deleteButton);

        content.append(topline, description, technologies, actions);

        card.append(image, content);

        adminProjectsList.appendChild(card);
    });
}


// ========================================
// 10. RESET PROJECT FORM
// ========================================

function resetProjectForm() {
    projectForm.reset();

    editingProjectId = null;

    formHeading.textContent = "Add New Project";
    saveProjectButton.textContent = "Save Project";
    cancelEditButton.hidden = true;

    showFormMessage("");
}


// ========================================
// 11. EDIT EXISTING PROJECT
// ========================================

function startEditingProject(projectId) {
    const project = projectsCache.find(
        (item) => item.id === projectId
    );

    if (!project) return;

    editingProjectId = projectId;

    projectTitle.value = project.title || "";
    projectLiveUrl.value = project.liveUrl || "";
    projectGithubUrl.value = project.githubUrl || "";

    projectImageType.value = project.imageType || "url";

    projectImageUrl.value =
        project.imageUrl ||
        project.image ||
        "";

    projectImageType.dispatchEvent(new Event("change"));

    // Restore the saved image path after updating the input settings.

    projectImageUrl.value =
        project.imageUrl ||
        project.image ||
        "";

    projectImageUrl.dispatchEvent(new Event("input"));

    projectTechnologies.value = Array.isArray(project.technologies) ?
        project.technologies.join(", ") :
        project.technologies || "";

    projectDescription.value = project.description || "";
    projectFeatured.checked = project.featured === true;

    formHeading.textContent = "Edit Project";
    saveProjectButton.textContent = "Update Project";
    cancelEditButton.hidden = false;

    showFormMessage("");

    document.getElementById("projectFormSection").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// ========================================
// 12. SAVE OR UPDATE PROJECT
// ========================================

projectForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!isAuthorizedAdmin || !auth.currentUser) {
        showFormMessage(
            "Your admin session has expired. Please sign in again.",
            true
        );
        return;
    }

    const title = projectTitle.value.trim();
    const liveUrl = projectLiveUrl.value.trim();
    const githubUrl = projectGithubUrl.value.trim();
    const imageUrl = projectImageUrl.value.trim();
    const imageType = projectImageType.value;
    const description = projectDescription.value.trim();

    const technologies = projectTechnologies.value
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean);

    const featured = projectFeatured.checked;

    if (!title || !liveUrl || !imageUrl || !description) {
        showFormMessage(
            "Please fill in all required fields.",
            true
        );
        return;
    }

    // Keep the homepage limit at four featured projects.

    if (featured) {
        const alreadyFeaturedCount = projectsCache.filter(
            (project) =>
            project.featured === true &&
            project.id !== editingProjectId
        ).length;

        if (alreadyFeaturedCount >= 4) {
            showFormMessage(
                "You already have four featured projects. Unfeature another project first.",
                true
            );
            return;
        }
    }

    const projectData = {
        title,
        liveUrl,
        githubUrl,
        imageUrl,
        imageType,
        description,
        technologies,
        featured,
        updatedAt: serverTimestamp()
    };

    saveProjectButton.disabled = true;

    saveProjectButton.textContent = editingProjectId ?
        "Updating..." :
        "Saving...";

    try {
        if (editingProjectId) {
            await updateDoc(
                doc(db, "projects", editingProjectId),
                projectData
            );

            showFormMessage("Project updated successfully!");

        } else {
            await addDoc(
                collection(db, "projects"), {
                    ...projectData,
                    createdAt: serverTimestamp()
                }
            );

            showFormMessage("Project added successfully!");
        }

        resetProjectForm();

        await loadProjects();

    } catch (error) {
        console.error("Could not save project:", error.code);

        showFormMessage(
            "Could not save the project. Check your Firestore rules and internet connection.",
            true
        );

    } finally {
        saveProjectButton.disabled = false;

        saveProjectButton.textContent = editingProjectId ?
            "Update Project" :
            "Save Project";

        if (editingProjectId === null) {
            saveProjectButton.textContent = "Save Project";
        }
    }
});


// ========================================
// 13. DELETE PROJECT
// ========================================

async function deleteProject(projectId, projectTitleText) {
    if (!isAuthorizedAdmin || !auth.currentUser) return;

    const confirmed = window.confirm(
        `Are you sure you want to delete "${projectTitleText}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
        await deleteDoc(doc(db, "projects", projectId));

        if (editingProjectId === projectId) {
            resetProjectForm();
        }

        showProjectsMessage("Project deleted successfully.");

        await loadProjects();

    } catch (error) {
        console.error("Could not delete project:", error.code);

        showProjectsMessage(
            "Could not delete this project. Check your Firestore rules.",
            true
        );
    }
}


// ========================================
// 14. CANCEL EDITING
// ========================================

cancelEditButton.addEventListener("click", resetProjectForm);


// ========================================
// 15. REFRESH PROJECTS
// ========================================

refreshProjectsButton.addEventListener("click", loadProjects);


// ========================================
// 16. LOG OUT
// ========================================

logoutButton.addEventListener("click", async () => {
    try {
        await signOut(auth);

        window.location.replace("./admin-login.html");

    } catch (error) {
        console.error("Logout failed:", error.code);

        showProjectsMessage(
            "Could not log out. Please try again.",
            true
        );
    }
});

// ========================================
// 17. PROJECT IMAGE SOURCE AND PREVIEW
// ========================================

// Update the input instructions when the source changes.

projectImageType.addEventListener("change", () => {


    const isLocal = projectImageType.value === "local";

    projectImageUrl.value = "";

    imageInputHelp.textContent = isLocal ?
        "Example: ./assets/images/ace-autos.jpg" :
        "Paste a direct URL to an image hosted online.";

    projectImageUrl.placeholder = isLocal ?
        "./assets/images/project.jpg" :
        "https://example.com/image.jpg";

    projectImagePreview.removeAttribute("src");
    imagePreviewContainer.hidden = true;
    imagePreviewMessage.textContent = "";


});

// Preview the selected image source.

projectImageUrl.addEventListener("input", () => {


    const imagePath = projectImageUrl.value.trim();

    // Hide the preview if the input is empty.

    if (!imagePath) {

        projectImagePreview.removeAttribute("src");
        imagePreviewContainer.hidden = true;
        imagePreviewMessage.textContent = "";

        return;

    }

    // Validate online image URLs.

    if (projectImageType.value === "url") {

        try {

            const parsedUrl = new URL(imagePath);

            if (!["http:", "https:"].includes(parsedUrl.protocol)) {
                throw new Error("Invalid image URL");
            }

        } catch {

            imagePreviewContainer.hidden = true;
            imagePreviewMessage.textContent = "";

            return;

        }

    } else {

        // Local paths must be relative paths within the website.

        if (
            imagePath.startsWith("/") ||
            imagePath.includes("..") ||
            imagePath.includes("\\") ||
            /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(imagePath) ||
            imagePath.startsWith("//")
        ) {

            imagePreviewContainer.hidden = true;
            imagePreviewMessage.textContent =
                "Enter a relative path inside your project folder.";

            return;

        }

    }

    // Display the image preview.

    imagePreviewContainer.hidden = false;

    imagePreviewMessage.textContent = "Loading image preview...";

    projectImagePreview.onload = () => {

        imagePreviewMessage.textContent =
            "Image loaded successfully.";

    };

    projectImagePreview.onerror = () => {

        imagePreviewMessage.textContent =
            "Image could not be loaded. Check the image path or URL.";

    };

    projectImagePreview.src = imagePath;


});