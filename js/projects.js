// ========================================
// PROJECT SECTION RENDERER
// Fetches projects from Firebase Firestore
// ========================================

import { db } from "./firebase-config.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "firebase/firestore";

// ========================================
// 1. SELECT PROJECT CONTAINER
// ========================================

const projectsContainer = document.getElementById("projects");

// ========================================
// 2. DETECT WHICH PAGE IS OPEN
// ========================================

const isProjectsPage = /(?:^|\/)Project\.html$/i.test(
    window.location.pathname
);

// ========================================
// 3. CREATE A PROJECT CARD
// ========================================

function createProjectCard(project, index) {
    const card = document.createElement("article");

    card.className = "project-card";
    card.dataset.aos = "fade-up";
    card.dataset.aosDuration = "900";

    // ------------------------------------
    // Project image link
    // ------------------------------------

    const imageLink = document.createElement("a");

    imageLink.className = "project-card__image-link";
    imageLink.href = project.liveUrl || "#";
    imageLink.target = "_blank";
    imageLink.rel = "noopener noreferrer";

    imageLink.setAttribute(
        "aria-label",
        `View ${project.title}`
    );

    const imageWrap = document.createElement("div");

    imageWrap.className = "project-card__image-wrap";

    const image = document.createElement("img");

    image.className = "project-card__image";

    // Support both Firebase image URLs and existing local images.
    const imageSource = project.imageUrl || project.image || "";

    if (imageSource) {
        image.src = imageSource.startsWith("http")
            ? imageSource
            : `/${imageSource.replace(/^\/+/, "")}`;
    }

    image.alt = `${project.title || "Project"} project preview`;
    image.loading = index < 2 ? "eager" : "lazy";
    image.decoding = "async";

    // Hide broken images rather than displaying a broken-image icon.
    image.addEventListener("error", () => {
        image.style.display = "none";
    });

    imageWrap.appendChild(image);
    imageLink.appendChild(imageWrap);

    // ------------------------------------
    // Project details
    // ------------------------------------

    const details = document.createElement("div");

    details.className = "project-card__details";

    // Featured badge
    if (project.featured) {
        const badge = document.createElement("span");

        badge.className = "project-card__badge";
        badge.textContent = "Featured Project";

        details.appendChild(badge);
    }

    // Project title
    const title = document.createElement("h2");

    title.className = "project-card__title";

    const titleLink = document.createElement("a");

    titleLink.href = project.liveUrl || "#";
    titleLink.target = "_blank";
    titleLink.rel = "noopener noreferrer";
    titleLink.textContent = project.title || "Untitled Project";

    title.appendChild(titleLink);

    // Project description
    const description = document.createElement("p");

    description.className = "project-card__description";
    description.textContent = project.description || "";

    // Live website link
    const liveLink = document.createElement("a");

    liveLink.className = "project-card__live-link";
    liveLink.href = project.liveUrl || "#";
    liveLink.target = "_blank";
    liveLink.rel = "noopener noreferrer";

    liveLink.innerHTML = 'Live <span aria-hidden="true">↗</span>';

    details.append(title, description, liveLink);

    // ------------------------------------
    // Assemble card
    // ------------------------------------

    card.append(imageLink, details);

    return card;
}

// ========================================
// 4. DISPLAY A MESSAGE
// ========================================

function showMessage(message) {
    if (!projectsContainer) return;

    const paragraph = document.createElement("p");

    paragraph.className = "projects-message";
    paragraph.textContent = message;

    projectsContainer.replaceChildren(paragraph);
}

// ========================================
// 5. LOAD PROJECTS FROM FIREBASE
// ========================================

async function loadProjects() {
    if (!projectsContainer) return;

    showMessage("Loading projects...");

    try {
        // Read all documents from the projects collection.
        const projectsQuery = query(
            collection(db, "projects"),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(projectsQuery);

        // Convert Firestore documents into regular JavaScript objects.
        const projects = snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data()
        }));

        // ------------------------------------
        // Choose which projects to display
        // ------------------------------------

        let visibleProjects;

        if (isProjectsPage) {
            // Project.html displays every project.
            visibleProjects = projects;
        } else {
            // Homepage displays up to four featured projects.
            visibleProjects = projects
                .filter((project) => project.featured === true)
                .slice(0, 4);
        }

        // ------------------------------------
        // Handle an empty project collection
        // ------------------------------------

        if (visibleProjects.length === 0) {
            showMessage(
                isProjectsPage
                    ? "No projects have been added yet."
                    : "No featured projects are available yet."
            );

            return;
        }

        // ------------------------------------
        // Render project cards
        // ------------------------------------

        const cards = visibleProjects.map((project, index) =>
            createProjectCard(project, index)
        );

        projectsContainer.replaceChildren(...cards);

        // Refresh AOS animations if the library is available.
        if (window.AOS) {
            window.AOS.refresh();
        }

    } catch (error) {
        console.error("Unable to load portfolio projects:", error);

        showMessage(
            "We couldn't load the projects right now. Please try again later."
        );
    }
}

// ========================================
// 6. START THE PROJECT LOADER
// ========================================

loadProjects();