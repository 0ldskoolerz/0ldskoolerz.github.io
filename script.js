// Store for repositories data
let allRepositories = [];

// Fetch GitHub repositories
async function fetchRepositories() {
    const reposList = document.getElementById('repos-list');
    
    try {
        const response = await fetch('https://api.github.com/users/0ldskoolerz/repos?sort=updated&per_page=30');
        
        if (!response.ok) {
            throw new Error('Failed to fetch repositories');
        }
        
        const repos = await response.json();
        
        if (repos.length === 0) {
            reposList.innerHTML = '<p class="loading">No repositories found yet.</p>';
            return;
        }
        
        // Store repositories and categorize them
        allRepositories = repos.map(repo => ({
            ...repo,
            category: categorizeRepository(repo)
        }));
        
        // Update repo count
        document.getElementById('repo-count').textContent = repos.length;
        
        // Render all repositories initially
        renderRepositories(allRepositories);
        
    } catch (error) {
        console.error('Error fetching repositories:', error);
        reposList.innerHTML = '<p class="loading">Unable to load repositories. Please try again later.</p>';
    }
}

// Categorize repository based on language or name
function categorizeRepository(repo) {
    if (repo.language === 'JavaScript' || repo.language === 'TypeScript') {
        return 'javascript';
    } else if (repo.language === 'HTML' || repo.language === 'CSS' || repo.name.includes('web') || repo.name.includes('site')) {
        return 'web';
    } else {
        return 'other';
    }
}

// Render repositories
function renderRepositories(repos) {
    const reposList = document.getElementById('repos-list');
    
    if (repos.length === 0) {
        reposList.innerHTML = '<p class="loading">No repositories match the selected filter.</p>';
        return;
    }
    
    reposList.innerHTML = repos.map(repo => `
        <div class="repo-card" data-category="${repo.category}">
            <h3>
                <a href="${repo.html_url}" target="_blank" class="repo-link">
                    ${repo.name}
                </a>
            </h3>
            <p class="description">${repo.description || 'No description available'}</p>
            <div class="repo-meta">
                ${repo.language ? `<span>📝 ${repo.language}</span>` : ''}
                <span>⭐ ${repo.stargazers_count}</span>
                ${repo.forks_count > 0 ? `<span>🔀 ${repo.forks_count}</span>` : ''}
            </div>
            <a href="${repo.html_url}" target="_blank" class="btn btn-primary">View Repository</a>
        </div>
    `).join('');
}

// Filter repositories
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter and render repositories
            if (filterValue === 'all') {
                renderRepositories(allRepositories);
            } else {
                const filtered = allRepositories.filter(repo => repo.category === filterValue);
                renderRepositories(filtered);
            }
        });
    });
}

// Smooth scroll behavior for navigation links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                const element = document.querySelector(href);
                element.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchRepositories();
    setupFilters();
    setupSmoothScroll();
});