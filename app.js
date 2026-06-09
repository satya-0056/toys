// app.js - Refined Client Controller with Scroll & Toy Animations

document.addEventListener("DOMContentLoaded", () => {
    if (!window.ToyDatabase) {
        console.error("Database data.js not found!");
        return;
    }

    // --- APPLICATION STATE ---
    const state = {
        filters: {
            search: "",
            category: "",
            subcategory: "",
            ageGroups: [],
            priceMin: 0,
            priceMax: 9999,
            ratings: 0,
            sortBy: "featured",
            page: 1,
            limit: 30
        },
        cart: JSON.parse(localStorage.getItem("toyutsav_cart")) || [],
        wishlist: JSON.parse(localStorage.getItem("toyutsav_wishlist")) || [],
        loading: false,
        hasMore: true,
        heroShowcase: null,
        modalShowcase: null
    };

    // --- DOM REFERENCES ---
    const dom = {
        heroCanvas: "heroCanvas",
        heroColorPanel: "heroColorPanel",
        heroChips: document.querySelectorAll(".selector-chip"),
        toysGrid: document.getElementById("toysGrid"),
        searchBar: document.getElementById("searchBar"),
        sortSelect: document.getElementById("sortSelect"),
        categoryList: document.getElementById("categoryList"),
        ageGroupFilters: document.getElementById("ageGroupFilters"),
        priceRange: document.getElementById("priceRange"),
        priceMaxLabel: document.getElementById("priceMaxLabel"),
        resetFilters: document.getElementById("resetFilters"),
        totalCountLabel: document.getElementById("totalCount"),
        infiniteScrollTrigger: document.getElementById("infiniteScrollTrigger"),
        
        // Cart / Wishlist Panel
        cartBtn: document.getElementById("cartBtn"),
        wishlistBtn: document.getElementById("wishlistBtn"),
        cartBadge: document.getElementById("cartBadge"),
        wishlistBadge: document.getElementById("wishlistBadge"),
        cartPanel: document.getElementById("cartPanel"),
        wishlistPanel: document.getElementById("wishlistPanel"),
        closeCartBtn: document.getElementById("closeCartBtn"),
        closeWishlistBtn: document.getElementById("closeWishlistBtn"),
        cartItemsList: document.getElementById("cartItemsList"),
        wishlistItemsList: document.getElementById("wishlistItemsList"),
        cartTotal: document.getElementById("cartTotal"),
        checkoutBtn: document.getElementById("checkoutBtn"),
        
        // Modal
        productModal: document.getElementById("productModal"),
        closeModalBtn: document.getElementById("closeModalBtn")
    };

    // --- FLOATING TOYS PARALLAX BACKGROUND SYSTEM ---
    function initFloatingBackground() {
        const floaters = [];
        const toyEmojis = ["🧸", "🎈", "🎡", "✈️", "⚽", "🧩", "🚂", "🚗", "🎠", "🎨", "🪁", "🎁", "🦖"];
        const container = document.getElementById("toyFloaterContainer");
        if (!container) return;

        // Generate floaters spread out vertically across the catalog height
        for (let i = 0; i < 20; i++) {
            const el = document.createElement("div");
            el.className = "toy-floater";
            el.textContent = toyEmojis[i % toyEmojis.length];
            
            const x = Math.random() * 92 + 2; // Keep away from screen edges
            const y = Math.random() * 3200 + 100; // Spread vertically
            const size = Math.random() * 1.5 + 1.2; // 1.2rem to 2.7rem
            const speed = Math.random() * 0.18 + 0.05; // Parallax speed factor
            
            el.style.left = `${x}%`;
            el.style.top = `${y}px`;
            el.style.fontSize = `${size}rem`;
            container.appendChild(el);
            
            floaters.push({ element: el, y, speed });
        }
        
        window.addEventListener("scroll", () => {
            const scrolled = window.scrollY;
            floaters.forEach(f => {
                const offset = scrolled * f.speed;
                // Move elements down and rotate them as user scrolls
                f.element.style.transform = `translateY(${offset}px) rotate(${scrolled * 0.04 * f.speed}deg)`;
            });
        });
    }
    initFloatingBackground();

    // --- INTERSECTION OBSERVER FOR SCROLL REVEALS ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("reveal");
                revealObserver.unobserve(entry.target); // Trigger only once
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: "0px 0px -50px 0px"
    });

    function applyScrollReveals() {
        document.querySelectorAll(".toy-card:not(.reveal)").forEach(card => {
            revealObserver.observe(card);
        });
    }

    // --- INITIALIZE HERO 3D SHOWCASE ---
    if (window.Toy3DShowcase) {
        state.heroShowcase = new window.Toy3DShowcase(dom.heroCanvas, dom.heroColorPanel);
        state.heroShowcase.loadModel("rc_car"); // Default to RC Car
        
        dom.heroChips.forEach(chip => {
            chip.addEventListener("click", (e) => {
                dom.heroChips.forEach(c => c.classList.remove("active"));
                chip.classList.add("active");
                const modelId = chip.getAttribute("data-model");
                state.heroShowcase.loadModel(modelId);
            });
        });
    }

    // --- PROCEDURAL CARDS VISUALS (SVG GENERATOR) ---
    function getProceduralVisual(toy) {
        if (toy.image) {
            return `<img src="${toy.image}" class="toy-card-img" alt="${toy.title}">`;
        }

        const category = toy.category;
        let icon = "🧸";
        let pathColor = "var(--primary)";
        let svgPattern = "";

        if (category === "Traditional Indian") {
            icon = "🐘";
            pathColor = "var(--secondary)";
            svgPattern = `
                <circle cx="50%" cy="50%" r="50" fill="none" stroke="${pathColor}" stroke-width="2" stroke-dasharray="10 5" />
                <circle cx="50%" cy="50%" r="35" fill="none" stroke="${pathColor}" stroke-width="1.5" stroke-dasharray="4 4" />
                <path d="M 125 25 L 125 175 M 25 100 L 225 100 M 54 29 L 196 171 M 54 171 L 196 29" stroke="${pathColor}" stroke-width="0.5" opacity="0.3" />
            `;
        } else if (category === "STEM & Learning") {
            icon = "🤖";
            pathColor = "var(--primary)";
            svgPattern = `
                <path d="M10,10 H240 V190 H10 Z" fill="none" stroke="${pathColor}" stroke-width="0.5" stroke-dasharray="5 15" />
                <circle cx="50" cy="50" r="4" fill="${pathColor}" />
                <circle cx="200" cy="150" r="4" fill="${pathColor}" />
                <path d="M50,50 L100,50 L120,80 L200,80 L200,150" fill="none" stroke="${pathColor}" stroke-width="1.5" />
                <path d="M30,120 L80,120 L100,100" fill="none" stroke="${pathColor}" stroke-width="1" />
            `;
        } else if (category === "Dolls & Plush") {
            icon = "🐯";
            pathColor = "#e84393";
            svgPattern = `
                <circle cx="30" cy="30" r="6" fill="${pathColor}" opacity="0.2"/>
                <circle cx="100" cy="60" r="12" fill="${pathColor}" opacity="0.15"/>
                <circle cx="180" cy="40" r="8" fill="${pathColor}" opacity="0.2"/>
                <circle cx="50" cy="140" r="14" fill="${pathColor}" opacity="0.1"/>
            `;
        } else if (category === "Vehicles & RC") {
            icon = "🏎️";
            pathColor = "#00cec9";
            svgPattern = `
                <path d="M0,40 L250,40 M0,80 L250,80 M0,120 L250,120 M0,160 L250,160" stroke="${pathColor}" stroke-width="1" opacity="0.2"/>
                <path d="M40,0 L40,200 M120,0 L120,200 M200,0 L200,200" stroke="${pathColor}" stroke-width="1" opacity="0.1"/>
            `;
        } else if (category === "Board Games") {
            icon = "🎲";
            pathColor = "var(--accent)";
            svgPattern = `
                <rect x="20" y="20" width="50" height="50" fill="${pathColor}" opacity="0.15"/>
                <rect x="120" y="20" width="50" height="50" fill="${pathColor}" opacity="0.15"/>
                <rect x="70" y="70" width="50" height="50" fill="${pathColor}" opacity="0.15"/>
            `;
        } else if (category === "Outdoor & Active") {
            icon = "🛴";
            pathColor = "#ff7675";
            svgPattern = `
                <path d="M -50 100 Q 125 -50 300 100 T 650 100" fill="none" stroke="${pathColor}" stroke-width="3" opacity="0.2"/>
                <path d="M -50 130 Q 125 -20 300 130 T 650 130" fill="none" stroke="${pathColor}" stroke-width="1.5" opacity="0.15"/>
            `;
        } else {
            icon = "🎨";
            pathColor = "#a29bfe";
            svgPattern = `
                <path d="M30,100 C80,30 170,170 220,100" fill="none" stroke="${pathColor}" stroke-width="2" />
                <circle cx="220" cy="100" r="5" fill="${pathColor}" />
            `;
        }

        return `
            <div class="procedural-svg-bg" style="background: radial-gradient(circle, rgba(255,255,255,0.01) 0%, rgba(9,10,21,0.5) 100%)">
                <svg width="250" height="200" viewBox="0 0 250 200" xmlns="http://www.w3.org/2000/svg">
                    ${svgPattern}
                </svg>
                <div class="procedural-svg-title">
                    <span class="procedural-svg-icon">${icon}</span>
                    <span style="font-size:0.65rem; color:var(--text-muted); font-weight:700; text-transform:uppercase; letter-spacing:1px">${toy.brand}</span>
                </div>
            </div>
        `;
    }

    // --- SIDEBAR FILTERS SETUP ---
    function initSidebarFilters() {
        const facets = window.ToyDatabase.getFacetCounts();
        
        // 1. Categories
        dom.categoryList.innerHTML = "";
        const allLi = document.createElement("li");
        allLi.className = "category-item active";
        allLi.innerHTML = `<span>All Collections</span> <span class="category-count">${window.ToyDatabase.database.length}</span>`;
        allLi.addEventListener("click", () => {
            document.querySelectorAll(".category-item").forEach(el => el.classList.remove("active"));
            allLi.classList.add("active");
            state.filters.category = "";
            state.filters.subcategory = "";
            triggerSearch(true);
        });
        dom.categoryList.appendChild(allLi);

        Object.keys(window.ToyDatabase.CATEGORY_MAP).forEach(cat => {
            const count = facets.categories[cat] || 0;
            const catLi = document.createElement("li");
            catLi.className = "category-item";
            catLi.innerHTML = `<span>${cat}</span> <span class="category-count">${count}</span>`;
            
            const subContainer = document.createElement("ul");
            subContainer.className = "subcategory-list";
            subContainer.style.display = "none";
            
            window.ToyDatabase.CATEGORY_MAP[cat].forEach(sub => {
                const subLi = document.createElement("li");
                subLi.className = "subcategory-item";
                subLi.textContent = sub;
                subLi.addEventListener("click", (e) => {
                    e.stopPropagation();
                    document.querySelectorAll(".subcategory-item").forEach(el => el.classList.remove("active"));
                    subLi.classList.add("active");
                    state.filters.subcategory = sub;
                    triggerSearch(true);
                });
                subContainer.appendChild(subLi);
            });

            catLi.appendChild(subContainer);

            catLi.addEventListener("click", () => {
                document.querySelectorAll(".category-item").forEach(el => el.classList.remove("active"));
                catLi.classList.add("active");
                
                document.querySelectorAll(".subcategory-list").forEach(el => el.style.display = "none");
                subContainer.style.display = "flex";

                state.filters.category = cat;
                state.filters.subcategory = "";
                document.querySelectorAll(".subcategory-item").forEach(el => el.classList.remove("active"));
                
                triggerSearch(true);
            });

            dom.categoryList.appendChild(catLi);
        });

        // 2. Age Groups
        dom.ageGroupFilters.innerHTML = "";
        const ageList = Object.keys(facets.ageGroups).sort();
        
        ageList.forEach(age => {
            const count = facets.ageGroups[age] || 0;
            const label = document.createElement("label");
            label.className = "checkbox-label";
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = age;
            checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                    state.filters.ageGroups.push(age);
                } else {
                    state.filters.ageGroups = state.filters.ageGroups.filter(g => g !== age);
                }
                triggerSearch(true);
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${age} (${count})`));
            dom.ageGroupFilters.appendChild(label);
        });

        // 3. Price slider
        dom.priceRange.min = facets.priceRange.min;
        dom.priceRange.max = facets.priceRange.max;
        dom.priceRange.value = facets.priceRange.max;
        state.filters.priceMax = facets.priceRange.max;
        dom.priceMaxLabel.textContent = `₹${facets.priceRange.max}`;

        dom.priceRange.addEventListener("input", (e) => {
            const val = parseInt(e.target.value);
            dom.priceMaxLabel.textContent = `₹${val}`;
            state.filters.priceMax = val;
            debouncePriceSearch();
        });
    }

    let priceTimeout = null;
    function debouncePriceSearch() {
        clearTimeout(priceTimeout);
        priceTimeout = setTimeout(() => {
            triggerSearch(true);
        }, 300);
    }

    // --- SEARCH AND FILTER INTERACTIONS ---
    let searchTimeout = null;
    dom.searchBar.addEventListener("input", (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            state.filters.search = e.target.value;
            triggerSearch(true);
        }, 400);
    });

    dom.sortSelect.addEventListener("change", (e) => {
        state.filters.sortBy = e.target.value;
        triggerSearch(true);
    });

    dom.resetFilters.addEventListener("click", () => {
        state.filters.search = "";
        state.filters.category = "";
        state.filters.subcategory = "";
        state.filters.ageGroups = [];
        state.filters.priceMax = 9999;
        state.filters.sortBy = "featured";
        
        dom.searchBar.value = "";
        dom.sortSelect.value = "featured";
        
        document.querySelectorAll(".category-item").forEach(el => el.classList.remove("active"));
        document.querySelector(".category-item").classList.add("active");
        document.querySelectorAll(".subcategory-list").forEach(el => el.style.display = "none");
        document.querySelectorAll(".subcategory-item").forEach(el => el.classList.remove("active"));
        
        dom.ageGroupFilters.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = false);

        const facets = window.ToyDatabase.getFacetCounts();
        dom.priceRange.value = facets.priceRange.max;
        dom.priceMaxLabel.textContent = `₹${facets.priceRange.max}`;
        state.filters.priceMax = facets.priceRange.max;

        triggerSearch(true);
    });

    function triggerSearch(resetPage = true) {
        if (resetPage) {
            state.filters.page = 1;
            dom.toysGrid.innerHTML = "";
            state.hasMore = true;
        }

        if (state.loading) return;
        state.loading = true;

        const skeletonCount = state.filters.page === 1 ? 6 : 3;
        const skeletons = Array(skeletonCount).fill(0).map(() => {
            const s = document.createElement("div");
            s.className = "skeleton-card";
            return s;
        });
        skeletons.forEach(s => dom.toysGrid.appendChild(s));

        setTimeout(() => {
            const result = window.ToyDatabase.queryToys(state.filters);
            skeletons.forEach(s => s.remove());

            state.hasMore = result.hasMore;
            dom.totalCountLabel.textContent = result.totalCount.toLocaleString();

            if (result.items.length === 0 && state.filters.page === 1) {
                dom.toysGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted)">
                        <span style="font-size: 3rem; display: block; margin-bottom: 16px">🧸</span>
                        <h3>No toys match your criteria</h3>
                        <p style="margin-top:8px">Try clearing filters or search terms to explore all collections.</p>
                    </div>
                `;
            } else {
                result.items.forEach(toy => {
                    const card = createToyCard(toy);
                    dom.toysGrid.appendChild(card);
                });
            }

            // Apply scroll reveal triggers to newly added cards
            applyScrollReveals();

            state.loading = false;
            
            if (state.hasMore) {
                dom.infiniteScrollTrigger.style.display = "flex";
            } else {
                dom.infiniteScrollTrigger.style.display = "none";
            }
        }, 120);
    }

    function createToyCard(toy) {
        const card = document.createElement("div");
        card.className = "toy-card glass";
        card.setAttribute("data-id", toy.id);

        const badgeHtml = [];
        if (toy.isNew) badgeHtml.push(`<span class="badge badge-new">New</span>`);
        if (toy.has3D) badgeHtml.push(`<span class="badge badge-3d">3D View</span>`);

        const isWishlisted = state.wishlist.some(item => item.id === toy.id);

        card.innerHTML = `
            <div class="toy-card-visual">
                ${getProceduralVisual(toy)}
                <div class="toy-card-badges">${badgeHtml.join("")}</div>
                <button class="wishlist-add-btn" aria-label="Add to wishlist" style="color: ${isWishlisted ? '#ff3e6c' : ''}">
                    <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </button>
            </div>
            <div class="toy-card-info">
                <span class="toy-card-category">${toy.category} &bull; ${toy.subcategory}</span>
                <h3 class="toy-card-title">${toy.title}</h3>
                <div class="toy-card-meta">
                    <span class="toy-card-rating">
                        <svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        ${toy.rating}
                    </span>
                    <span class="toy-card-reviews">(${toy.reviewsCount} reviews)</span>
                </div>
                <div class="toy-card-price-action">
                    <div class="price-tag"><small>₹</small>${toy.price.toLocaleString("en-IN")}</div>
                    <button class="card-cta-btn">View Details</button>
                </div>
            </div>
        `;

        card.querySelector(".wishlist-add-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            toggleWishlist(toy);
        });

        card.addEventListener("click", () => {
            openProductModal(toy);
        });

        return card;
    }

    // --- INFINITE SCROLL / LOAD MORE ---
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && state.hasMore && !state.loading) {
            state.filters.page += 1;
            triggerSearch(false);
        }
    }, {
        rootMargin: "250px"
    });
    observer.observe(dom.infiniteScrollTrigger);

    // --- PRODUCT DETAIL MODAL ---
    function openProductModal(toy) {
        const modal = dom.productModal;
        
        modal.querySelector(".modal-category-breadcrumb").textContent = `${toy.category} / ${toy.subcategory}`;
        modal.querySelector(".modal-title").textContent = toy.title;
        modal.querySelector(".modal-rating").innerHTML = `
            <svg style="width:16px; height:16px; fill:var(--accent)" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            ${toy.rating} (${toy.reviewsCount} reviews)
        `;
        modal.querySelector(".modal-desc").textContent = toy.description;
        modal.querySelector(".modal-price").innerHTML = `<small>₹</small>${toy.price.toLocaleString("en-IN")}`;
        
        modal.querySelector(".modal-spec-list").innerHTML = `
            <div class="spec-item"><span>Brand:</span><strong>${toy.brand}</strong></div>
            <div class="spec-item"><span>Age Group:</span><strong>${toy.ageGroup}</strong></div>
            <div class="spec-item"><span>Category:</span><strong>${toy.category}</strong></div>
            <div class="spec-item"><span>Availability:</span><strong style="color: #2ecc71">In Stock</strong></div>
        `;

        const modalImgPanel = modal.querySelector(".modal-main-img");
        const modalCanvasContainer = modal.querySelector(".modal-3d-canvas-container");
        const toggle3DBtn = modal.querySelector(".view-3d-toggle-btn");
        const colorPanelContainer = modal.querySelector(".modal-color-customizer");

        if (toy.image) {
            modalImgPanel.src = toy.image;
            modalImgPanel.style.display = "block";
        } else {
            modalImgPanel.style.display = "none";
        }

        modalCanvasContainer.style.display = "none";
        colorPanelContainer.style.display = "none";

        if (state.modalShowcase) {
            state.modalShowcase.destroy();
            state.modalShowcase = null;
        }

        if (toy.has3D && window.Toy3DShowcase) {
            toggle3DBtn.style.display = "flex";
            toggle3DBtn.innerHTML = `
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm1 15h-2v-6h2v6zm0-8h-2v-2h2v2z"/></svg>
                Explore 3D Customizer
            `;
            
            toggle3DBtn.onclick = () => {
                if (modalCanvasContainer.style.display === "none") {
                    modalCanvasContainer.style.display = "block";
                    modalImgPanel.style.display = "none";
                    toggle3DBtn.innerHTML = "View Catalog Photo";
                    colorPanelContainer.style.display = "block";

                    state.modalShowcase = new window.Toy3DShowcase("modalCanvas", "modalColorPanel");
                    state.modalShowcase.loadModel(toy.modelId || "rc_car");
                } else {
                    modalCanvasContainer.style.display = "none";
                    if (toy.image) modalImgPanel.style.display = "block";
                    toggle3DBtn.innerHTML = `
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10-4.48-10-10-10zm1 15h-2v-6h2v6zm0-8h-2v-2h2v2z"/></svg>
                        Explore 3D Customizer
                    `;
                    colorPanelContainer.style.display = "none";

                    if (state.modalShowcase) {
                        state.modalShowcase.destroy();
                        state.modalShowcase = null;
                    }
                }
            };
        } else {
            toggle3DBtn.style.display = "none";
        }

        const addToCartBtn = modal.querySelector(".modal-add-cart-btn");
        addToCartBtn.onclick = () => {
            addToCart(toy);
            closeProductModal();
        };

        modal.style.display = "flex";
        document.body.style.overflow = "hidden";
    }

    function closeProductModal() {
        dom.productModal.style.display = "none";
        document.body.style.overflow = "";
        if (state.modalShowcase) {
            state.modalShowcase.destroy();
            state.modalShowcase = null;
        }
    }

    dom.closeModalBtn.addEventListener("click", closeProductModal);
    dom.productModal.addEventListener("click", (e) => {
        if (e.target === dom.productModal) closeProductModal();
    });

    // --- CART AND WISHLIST LOGIC ---
    function updateCartUI() {
        dom.cartBadge.textContent = state.cart.length;
        dom.cartBadge.style.display = state.cart.length > 0 ? "flex" : "none";

        dom.cartItemsList.innerHTML = "";
        let total = 0;

        if (state.cart.length === 0) {
            dom.cartItemsList.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); margin-top: 40px">
                    <span style="font-size: 2.5rem; display:block; margin-bottom:12px">🛒</span>
                    Your cart is empty
                </div>
            `;
        } else {
            state.cart.forEach(item => {
                total += item.price;
                const li = document.createElement("div");
                li.className = "panel-item-card";
                li.innerHTML = `
                    <div class="panel-item-img-placeholder">🧸</div>
                    <div class="panel-item-details">
                        <span class="panel-item-title">${item.title}</span>
                        <span class="panel-item-price">₹${item.price.toLocaleString("en-IN")}</span>
                    </div>
                    <button class="remove-item-btn" aria-label="Remove item">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                `;
                li.querySelector(".remove-item-btn").addEventListener("click", () => {
                    removeFromCart(item.id);
                });
                dom.cartItemsList.appendChild(li);
            });
        }

        dom.cartTotal.textContent = `₹${total.toLocaleString("en-IN")}`;
        localStorage.setItem("toyutsav_cart", JSON.stringify(state.cart));
    }

    function addToCart(toy) {
        state.cart.push(toy);
        updateCartUI();
        showNotification(`${toy.title} added to cart!`);
    }

    function removeFromCart(id) {
        state.cart = state.cart.filter(item => item.id !== id);
        updateCartUI();
    }

    function updateWishlistUI() {
        dom.wishlistBadge.textContent = state.wishlist.length;
        dom.wishlistBadge.style.display = state.wishlist.length > 0 ? "flex" : "none";

        dom.wishlistItemsList.innerHTML = "";

        if (state.wishlist.length === 0) {
            dom.wishlistItemsList.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); margin-top: 40px">
                    <span style="font-size: 2.5rem; display:block; margin-bottom:12px">💖</span>
                    Your wishlist is empty
                </div>
            `;
        } else {
            state.wishlist.forEach(item => {
                const li = document.createElement("div");
                li.className = "panel-item-card";
                li.innerHTML = `
                    <div class="panel-item-img-placeholder">🧸</div>
                    <div class="panel-item-details">
                        <span class="panel-item-title">${item.title}</span>
                        <span class="panel-item-price">₹${item.price.toLocaleString("en-IN")}</span>
                    </div>
                    <button class="remove-item-btn" aria-label="Remove item">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                `;
                li.querySelector(".remove-item-btn").addEventListener("click", () => {
                    toggleWishlist(item);
                });
                dom.wishlistItemsList.appendChild(li);
            });
        }

        localStorage.setItem("toyutsav_wishlist", JSON.stringify(state.wishlist));
    }

    function toggleWishlist(toy) {
        const index = state.wishlist.findIndex(item => item.id === toy.id);
        if (index > -1) {
            state.wishlist.splice(index, 1);
            showNotification(`Removed from Wishlist`);
        } else {
            state.wishlist.push(toy);
            showNotification(`Added to Wishlist!`);
        }
        updateWishlistUI();

        const card = document.querySelector(`.toy-card[data-id="${toy.id}"]`);
        if (card) {
            const btn = card.querySelector(".wishlist-add-btn");
            btn.style.color = index > -1 ? "" : "#ff3e6c";
        }
    }

    function showNotification(msg) {
        const notif = document.createElement("div");
        notif.style.position = "fixed";
        notif.style.bottom = "20px";
        notif.style.left = "50%";
        notif.style.transform = "translateX(-50%) translateY(100px)";
        notif.style.background = "linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%)";
        notif.style.color = "#ffffff";
        notif.style.padding = "12px 24px";
        notif.style.borderRadius = "30px";
        notif.style.boxShadow = "0 8px 30px rgba(0,0,0,0.5)";
        notif.style.fontSize = "0.9rem";
        notif.style.fontWeight = "600";
        notif.style.zIndex = "300";
        notif.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        notif.textContent = msg;

        document.body.appendChild(notif);
        
        setTimeout(() => {
            notif.style.transform = "translateX(-50%) translateY(0)";
        }, 50);

        setTimeout(() => {
            notif.style.transform = "translateX(-50%) translateY(100px)";
            setTimeout(() => notif.remove(), 400);
        }, 2500);
    }

    dom.cartBtn.addEventListener("click", () => {
        dom.cartPanel.classList.toggle("open");
        dom.wishlistPanel.classList.remove("open");
    });
    dom.wishlistBtn.addEventListener("click", () => {
        dom.wishlistPanel.classList.toggle("open");
        dom.cartPanel.classList.remove("open");
    });
    dom.closeCartBtn.addEventListener("click", () => dom.cartPanel.classList.remove("open"));
    dom.closeWishlistBtn.addEventListener("click", () => dom.wishlistPanel.classList.remove("open"));

    dom.checkoutBtn.addEventListener("click", () => {
        if (state.cart.length === 0) return;
        alert(`🎉 Thank you for placing your order of ${state.cart.length} toys with ToyUtsav!\n\nWe will get in touch with you shortly.`);
        state.cart = [];
        updateCartUI();
        dom.cartPanel.classList.remove("open");
    });

    // --- INITIALIZE CATALOG DATA RENDER ---
    initSidebarFilters();
    triggerSearch(true);
    updateCartUI();
    updateWishlistUI();
});
