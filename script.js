// Store for repositories data
let allRepositories = [];

// Fetch GitHub repositories
async function fetchRepositories() {
    const reposList = document.getElementById('repos-list');
    
    try {
        const response = await fetch('https://api.github.com/users/0ldskoolerz/repos?sort=updated&per_page=50');
        
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
        
        console.log('Repositories loaded:', allRepositories.length);
        
    } catch (error) {
        console.error('Error fetching repositories:', error);
        reposList.innerHTML = '<p class="loading">Unable to load repositories. Please try again later.</p>';
    }
}

// Categorize repository based on language or name
function categorizeRepository(repo) {
    const name = repo.name.toLowerCase();
    const language = repo.language || '';

    // Web category
    if (language === 'HTML' || language === 'CSS' || 
        name.includes('web') || name.includes('site') || name.includes('github.io')) {
        return 'web';
    }
    
    // JavaScript category
    if (language === 'JavaScript' || language === 'TypeScript' || 
        name.includes('app') || name.includes('js')) {
        return 'javascript';
    }
    
    // Projects category (more substantial projects)
    if (repo.topics && repo.topics.length > 0) {
        return 'projects';
    }
    
    return 'other';
}

// Render repositories
function renderRepositories(repos) {
    const reposList = document.getElementById('repos-list');
    
    if (repos.length === 0) {
        reposList.innerHTML = '<p class="loading">No repositories match the selected category.</p>';
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

// Setup category filters
function setupCategoryFilters() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active tab
            categoryTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter and render repositories
            if (category === 'all') {
                renderRepositories(allRepositories);
            } else {
                const filtered = allRepositories.filter(repo => repo.category === category);
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
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Add scroll animation for elements
function setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.repo-card, .content-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, fetching repositories...');
    fetchRepositories();
    setupCategoryFilters();
    setupSmoothScroll();
    setupScrollAnimation();
});