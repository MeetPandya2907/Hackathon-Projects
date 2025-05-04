document.addEventListener('DOMContentLoaded', () => {
    // Calendar functionality
    const checkInInput = document.getElementById('checkInInput');
    const checkOutInput = document.getElementById('checkOutInput');
    const calendarContainer = document.getElementById('calendarContainer');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarGrid = document.querySelector('.calendar-grid');
    const clearDatesBtn = document.querySelector('.calendar-clear');
    const closeCalendarBtn = document.querySelector('.calendar-close');

    let currentDate = new Date();
    let displayedMonth = new Date(2025, 4); // May 2025
    let selectedCheckIn = new Date(2025, 4, 4); // May 4, 2025
    let selectedCheckOut = new Date(2025, 4, 9); // May 9, 2025
    let selecting = 'checkin'; // or 'checkout'

    function formatDate(date) {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    function updateInputs() {
        if (selectedCheckIn) {
            const checkInValue = document.querySelector('.check-in .date-value');
            if (checkInValue) {
                checkInValue.textContent = formatDate(selectedCheckIn);
            }
        }
        if (selectedCheckOut) {
            const checkOutValue = document.querySelector('.check-out .date-value');
            if (checkOutValue) {
                checkOutValue.textContent = formatDate(selectedCheckOut);
            }
        }
    }

    function generateCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        
        currentMonthElement.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        // Clear existing dates
        const existingDates = calendarGrid.querySelectorAll('.calendar-date');
        existingDates.forEach(date => date.remove());

        // Add empty cells for days before the first of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-date';
            calendarGrid.appendChild(emptyCell);
        }

        // Add dates
        for (let i = 1; i <= lastDate; i++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'calendar-date';
            const currentDateObj = new Date(year, month, i);
            
            // Disable past dates
            if (currentDateObj < new Date()) {
                dateCell.classList.add('disabled');
            } else {
                dateCell.addEventListener('click', () => handleDateClick(currentDateObj));
                
                // Check if date is selected or in range
                if (selectedCheckIn && selectedCheckOut) {
                    if (currentDateObj >= selectedCheckIn && currentDateObj <= selectedCheckOut) {
                        dateCell.classList.add('in-range');
                    }
                    if (currentDateObj.getTime() === selectedCheckIn.getTime()) {
                        dateCell.classList.add('range-start');
                    }
                    if (currentDateObj.getTime() === selectedCheckOut.getTime()) {
                        dateCell.classList.add('range-end');
                    }
                }
            }
            
            dateCell.textContent = i;
            calendarGrid.appendChild(dateCell);
        }
    }

    function handleDateClick(date) {
        if (selecting === 'checkin') {
            selectedCheckIn = date;
            selecting = 'checkout';
            if (selectedCheckOut && selectedCheckOut <= selectedCheckIn) {
                selectedCheckOut = null;
            }
        } else {
            if (date < selectedCheckIn) {
                selectedCheckIn = date;
            } else {
                selectedCheckOut = date;
                calendarContainer.style.display = 'none';
            }
            selecting = 'checkin';
        }
        
        updateInputs();
        generateCalendar(displayedMonth);
        updateTotalPrice();
    }

    // Update photo gallery with property images
    function updateGalleryImages(property) {
        // Main image
        const mainImg = document.querySelector('.photo-large .photo-img');
        if (mainImg && property.images.length > 0) {
            mainImg.src = `${property.images[0]}`;
            mainImg.alt = `${property.title} - Main Image`;
        }
        
        // Update the other gallery images
        const smallImages = [
            document.querySelector('.photo-small.top-right .photo-img'),
            document.querySelector('.photo-small.top-far-right .photo-img'),
            document.querySelector('.photo-small.bottom-right .photo-img'),
            document.querySelector('.photo-small.bottom-far-right .photo-img')
        ];
        
        smallImages.forEach((img, index) => {
            if (img && property.images[index + 1]) {
                img.src = `${property.images[index + 1]}`;
                img.alt = `${property.title} - Image ${index + 2}`;
            }
        });
        
        // Setup show all photos button
        const showAllPhotosBtn = document.querySelector('.photos-btn');
        if (showAllPhotosBtn) {
            showAllPhotosBtn.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Full photo gallery would open here');
            });
        }
    }

    function updatePropertyDetails(property) {
        // Update specifications
        const propertySpecs = document.querySelector('.property-specs');
        if (propertySpecs) {
            propertySpecs.innerHTML = `
                <span>${property.maxGuests}+ guests</span>
                <span class="dot">·</span>
                <span>${property.bedrooms} bedrooms</span>
                <span class="dot">·</span>
                <span>${property.beds} beds</span>
                <span class="dot">·</span>
                <span>${property.bathrooms} bathrooms</span>
            `;
        }
        
        // Update description
        const descriptionText = document.querySelector('.description-text p');
        if (descriptionText) {
            descriptionText.textContent = property.description;
        }
        
        // Update reviews header
        const reviewsHeader = document.querySelector('.reviews-header h2');
        if (reviewsHeader) {
            reviewsHeader.textContent = `★ ${property.rating} · ${property.reviews} reviews`;
        }
        
        // Update location
        const locationHeading = document.querySelector('.location-description h3');
        if (locationHeading) {
            locationHeading.textContent = property.location;
        }
        
        // Update host information
        const hostInfo = document.querySelector('.host-info h2');
        if (hostInfo) {
            hostInfo.textContent = `Hosted by ${property.host.name}`;
        }
        
        const hostStatus = document.querySelector('.host-info p');
        if (hostStatus) {
            hostStatus.textContent = `Joined in March 2022 · ${property.host.isSuperhost ? 'Superhost' : ''}`;
        }
        
        const hostPhotoLarge = document.querySelector('.host-photo-large');
        if (hostPhotoLarge) {
            hostPhotoLarge.src = property.host.image;
            hostPhotoLarge.alt = `Host ${property.host.name}`;
        }
    }

    function loadPropertyDetails() {
        // Get property ID from URL parameters or use default
        const urlParams = new URLSearchParams(window.location.search);
        const propertyId = urlParams.get('id') || '1';
        
        // Sample property data - in a real application, this would come from a database or API
        const properties = {
            '1': {
                title: '3BHK W/Pool Teakwood Villa By Gemstone Hospitality',
                location: 'Sahan, India',
                price: 20541,
                discount: 15, // percentage
                rating: 4.95,
                reviews: 19,
                images: ['img1.jpg', 'img2.jpg', 'img3.avif', 'img4.avif', 'img5.avif'],
                description: 'Discover a slice of paradise, Nestled in the embrace of majestic mountains, our villa is a haven of luxury and natural beauty. Immerse yourself in the serenity of a private pool, soak in breathtaking mountain views from the gazebo, and gather around the bonfire for magical evenings. It\'s not just accommodation; it's an unforgettable experience where every detail has been crafted to ensure your stay is exceptional. Embrace the allure of nature and luxury, making your stay a memory to treasure....',
                features: ['Self check-in', 'Designed for staying cool', 'Outdoor entertainment', 'Pool', 'Wifi', 'Free parking'],
                host: {
                    name: 'Viganesh',
                    rating: 4.95,
                    isSuperhost: true,
                    hostingSince: '1 year hosting',
                    image: 'https://a0.muscache.com/im/pictures/user/bd95bc93-444a-4c85-bce5-c7c773a219a2.jpg'
                },
                rooms: [
                    { name: 'Bedroom 1', beds: '1 double bed', image: 'img2.avif' },
                    { name: 'Bedroom 2', beds: '1 double bed', image: 'img3.avif' },
                    { name: 'Bedroom 3', beds: '1 double bed', image: 'img4.avif' }
                ],
                maxGuests: 16,
                bedrooms: 3,
                beds: 3,
                bathrooms: 3
            },
            '2': {
                title: 'Luxury Beach Villa with Private Pool',
                location: 'Mumbai, Maharashtra',
                price: 16583,
                discount: 12,
                rating: 4.93,
                reviews: 15,
                images: ['img6.jpg', 'img7.avif', 'img8.avif', 'img9.jpg', 'img10.jpg'],
                description: 'Experience luxury beachfront living at its finest with stunning ocean views from every room. Modern design meets comfort in this spacious villa with private access to the beach. Wake up to the sound of waves and enjoy spectacular sunsets from your private terrace. Perfect for family gatherings or special occasions.',
                features: ['Beachfront', 'Private pool', 'Ocean view', 'Full kitchen', 'Air conditioning', 'Wifi'],
                host: {
                    name: 'Priya',
                    rating: 4.97,
                    isSuperhost: true,
                    hostingSince: '3 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'Master Bedroom', beds: '1 king bed', image: 'img6.jpg' },
                    { name: 'Guest Room 1', beds: '1 queen bed', image: 'img7.avif' },
                    { name: 'Guest Room 2', beds: '2 single beds', image: 'img8.avif' }
                ],
                maxGuests: 8,
                bedrooms: 3,
                beds: 4,
                bathrooms: 3
            },
            '3': {
                title: 'Elegant Penthouse with Mountain Views',
                location: 'Delhi, NCR',
                price: 23827,
                discount: 8,
                rating: 4.82,
                reviews: 23,
                images: ['img2.avif', 'img3.avif', 'img11.jpg', 'img12.jpg', 'img1.avif'],
                description: 'Indulge in the height of luxury in this stunning penthouse with panoramic views of the city skyline and mountains beyond. Featuring modern designer furnishings, a private terrace, and exclusive access to premium amenities. Perfect for those seeking a sophisticated urban retreat with a touch of nature.',
                features: ['Mountain view', 'City view', 'Private terrace', 'Doorman', 'Gym', 'Hot tub'],
                host: {
                    name: 'Rajiv',
                    rating: 4.89,
                    isSuperhost: true,
                    hostingSince: '5 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'Master Suite', beds: '1 king bed', image: 'img11.jpg' },
                    { name: 'Luxury Room', beds: '1 queen bed', image: 'img12.jpg' },
                    { name: 'Guest Room', beds: '1 queen bed', image: 'img1.avif' }
                ],
                maxGuests: 6,
                bedrooms: 3,
                beds: 3,
                bathrooms: 2
            },
            '4': {
                title: 'Modern Apartment with Canal Views',
                location: 'Chennai, Tamil Nadu',
                price: 21329,
                discount: 0,
                rating: 4.95,
                reviews: 28,
                images: ['img4.avif', 'img7.avif', 'img9.jpg', 'img3.avif', 'img8.avif'],
                description: 'Discover this stunning modern apartment with breathtaking canal and city views. Floor-to-ceiling windows flood the space with natural light while offering unparalleled views of the vibrant city below. Featuring contemporary design and premium amenities, this urban oasis is perfect for those seeking comfort and style in the heart of the city.',
                features: ['Canal view', 'City view', 'Self check-in', 'High-speed WiFi', 'Fully equipped kitchen', 'Gym access'],
                host: {
                    name: 'Arun',
                    rating: 4.98,
                    isSuperhost: true,
                    hostingSince: '4 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'Master Bedroom', beds: '1 king bed', image: 'img7.avif' },
                    { name: 'Guest Room', beds: '1 queen bed', image: 'img9.jpg' }
                ],
                maxGuests: 4,
                bedrooms: 2,
                beds: 2,
                bathrooms: 2
            },
            '5': {
                title: 'Heritage Apartment in Colonial Building',
                location: 'Kolkata, West Bengal',
                price: 27241,
                discount: 5,
                rating: 4.85,
                reviews: 32,
                images: ['img5.avif', 'img10.jpg', 'img2.jpg', 'img11.jpg', 'img12.jpg'],
                description: 'Step back in time in this beautifully preserved heritage apartment housed in a colonial-era building. High ceilings, original wood floors, and antique furnishings create a nostalgic atmosphere, while modern amenities ensure a comfortable stay. Located in the historic district, this unique accommodation offers an authentic glimpse into the city\'s rich cultural past.',
                features: ['Historic building', 'Unique design', 'Central location', 'Balcony', 'Air conditioning', 'Breakfast included'],
                host: {
                    name: 'Rohan',
                    rating: 4.92,
                    isSuperhost: true,
                    hostingSince: '6 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'Master Suite', beds: '1 king bed', image: 'img10.jpg' },
                    { name: 'Heritage Room', beds: '1 queen bed', image: 'img11.jpg' }
                ],
                maxGuests: 4,
                bedrooms: 2,
                beds: 2,
                bathrooms: 1
            },
            '6': {
                title: 'Spacious Villa near Hussain Sagar',
                location: 'Hyderabad, Telangana',
                price: 37645,
                discount: 0,
                rating: 4.91,
                reviews: 17,
                images: ['img6.jpg', 'img1.jpg', 'img3.avif', 'img8.avif', 'img10.jpg'],
                description: 'Enjoy panoramic lake views from this spacious, modern villa located just minutes from Hussain Sagar. Featuring a private garden, outdoor entertainment areas, and luxurious interiors, this property is perfect for families or groups seeking a premium experience. The tranquil setting offers a peaceful retreat while remaining close to the city\'s major attractions.',
                features: ['Lake view', 'Private garden', 'Outdoor dining', 'Pool', '24/7 security', 'Smart home features'],
                host: {
                    name: 'Ananya',
                    rating: 4.96,
                    isSuperhost: true,
                    hostingSince: '3 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'Master Bedroom', beds: '1 king bed', image: 'img1.jpg' },
                    { name: 'Guest Room 1', beds: '1 queen bed', image: 'img3.avif' },
                    { name: 'Guest Room 2', beds: '2 single beds', image: 'img8.avif' }
                ],
                maxGuests: 6,
                bedrooms: 3,
                beds: 4,
                bathrooms: 3
            },
            '7': {
                title: 'Mountain Chalet with Panoramic Views',
                location: 'Shimla, Himachal Pradesh',
                price: 27867,
                discount: 10,
                rating: 4.88,
                reviews: 42,
                images: ['img7.avif', 'img2.avif', 'img4.avif', 'img9.jpg', 'img12.jpg'],
                description: 'Escape to this charming mountain chalet nestled in the Himalayas. Breathtaking panoramic mountain views greet you from every window, while the cozy interior with wood-burning fireplace creates the perfect atmosphere for relaxation. Ideal for nature lovers and those seeking a peaceful retreat in the mountains.',
                features: ['Mountain view', 'Fireplace', 'Private balcony', 'Hiking trails nearby', 'Fully-equipped kitchen', 'Heating'],
                host: {
                    name: 'Dev',
                    rating: 4.94,
                    isSuperhost: true,
                    hostingSince: '5 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'Master Bedroom', beds: '1 king bed', image: 'img2.avif' },
                    { name: 'Loft Bedroom', beds: '1 queen bed', image: 'img4.avif' },
                    { name: 'Mountain View Room', beds: '2 single beds', image: 'img9.jpg' }
                ],
                maxGuests: 6,
                bedrooms: 3,
                beds: 4,
                bathrooms: 2
            },
            '8': {
                title: 'Modern Urban Retreat',
                location: 'Pune, Maharashtra',
                price: 38808,
                discount: 0,
                rating: 4.93,
                reviews: 36,
                images: ['img8.avif', 'img5.avif', 'img1.avif', 'img6.jpg', 'img11.jpg'],
                description: 'This designer urban retreat offers the perfect blend of modern luxury and comfort in the heart of the city. The sleek, contemporary interior features high-end finishes, smart home technology, and stylish décor. Floor-to-ceiling windows provide abundant natural light and city views, creating a sophisticated atmosphere for discerning travelers.',
                features: ['Designer interior', 'Smart home', 'City view', 'Fitness center', 'Concierge service', 'Rooftop access'],
                host: {
                    name: 'Neha',
                    rating: 4.97,
                    isSuperhost: true,
                    hostingSince: '4 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'Master Suite', beds: '1 king bed', image: 'img5.avif' },
                    { name: 'Guest Room', beds: '1 queen bed', image: 'img1.avif' }
                ],
                maxGuests: 4,
                bedrooms: 2,
                beds: 2,
                bathrooms: 2
            },
            '9': {
                title: 'Beachfront Villa in North Goa',
                location: 'Goa',
                price: 31356,
                discount: 0,
                rating: 4.97,
                reviews: 52,
                images: ['img9.jpg', 'img3.avif', 'img7.avif', 'img10.jpg', 'img2.jpg'],
                description: 'Experience the ultimate beach getaway in this stunning oceanfront villa located on one of Goa\'s most beautiful beaches. Step directly from your private terrace onto golden sands, swim in the crystal-clear waters, and enjoy breathtaking sunsets from your beachfront infinity pool. This luxurious retreat combines indoor-outdoor living with elegant design and premium amenities.',
                features: ['Beachfront', 'Private infinity pool', 'Ocean view', 'Outdoor shower', 'Al fresco dining', 'Beach equipment'],
                host: {
                    name: 'Vikram',
                    rating: 4.99,
                    isSuperhost: true,
                    hostingSince: '7 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'Ocean Suite', beds: '1 king bed', image: 'img3.avif' },
                    { name: 'Beach Room', beds: '1 queen bed', image: 'img7.avif' },
                    { name: 'Garden View Room', beds: '2 single beds', image: 'img10.jpg' }
                ],
                maxGuests: 6,
                bedrooms: 3,
                beds: 4,
                bathrooms: 3
            },
            '10': {
                title: 'Waterfront Home with Backwater Views',
                location: 'Kochi, Kerala',
                price: 18500,
                discount: 5,
                rating: 4.89,
                reviews: 27,
                images: ['img1.avif', 'img10.jpg', 'img5.avif', 'img8.avif', 'img12.jpg'],
                description: 'Immerse yourself in the tranquil beauty of Kerala\'s famous backwaters from this authentic waterfront home. Traditional architecture harmonizes with modern comforts, while the private dock allows you to step directly onto a boat for backwater explorations. Enjoy peaceful sunrises, watch local fishermen, and experience the unique rhythm of life on the water.',
                features: ['Waterfront', 'Backwater views', 'Private dock', 'Traditional architecture', 'Boat rides available', 'Home-cooked Kerala meals'],
                host: {
                    name: 'Anita',
                    rating: 4.96,
                    isSuperhost: true,
                    hostingSince: '5 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'Waterfront Suite', beds: '1 king bed', image: 'img10.jpg' },
                    { name: 'Garden Room', beds: '1 queen bed', image: 'img5.avif' }
                ],
                maxGuests: 4,
                bedrooms: 2,
                beds: 2,
                bathrooms: 2
            },
            '11': {
                title: 'Royal Haveli with Courtyard',
                location: 'Jaipur, Rajasthan',
                price: 35670,
                discount: 0,
                rating: 4.95,
                reviews: 38,
                images: ['img2.avif', 'img11.jpg', 'img4.avif', 'img6.jpg', 'img9.jpg'],
                description: 'Step into royal heritage at this authentic haveli featuring intricately carved archways, colorful frescoes, and a stunning central courtyard. Each room tells a story of Rajasthan\'s rich history through traditional décor and artifacts. Modern amenities ensure comfort while maintaining the property\'s historic charm. Located in the heart of the Pink City, this unique accommodation offers an immersive cultural experience.',
                features: ['Historic haveli', 'Central courtyard', 'Traditional architecture', 'Roof terrace', 'Cultural experiences', 'Breakfast included'],
                host: {
                    name: 'Arjun',
                    rating: 4.98,
                    isSuperhost: true,
                    hostingSince: '8 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'Maharaja Suite', beds: '1 king bed', image: 'img11.jpg' },
                    { name: 'Royal Chamber', beds: '1 queen bed', image: 'img4.avif' },
                    { name: 'Heritage Room', beds: '1 queen bed', image: 'img6.jpg' }
                ],
                maxGuests: 6,
                bedrooms: 3,
                beds: 3,
                bathrooms: 3
            },
            '12': {
                title: 'Taj Mahal View from Private Balcony',
                location: 'Agra, Uttar Pradesh',
                price: 42924,
                discount: 0,
                rating: 4.98,
                reviews: 47,
                images: ['img9.avif', 'img12.jpg', 'img1.jpg', 'img5.avif', 'img7.avif'],
                description: 'Wake up to a breathtaking view of the Taj Mahal from your private balcony in this exclusive property. Watch as the morning light transforms the marble monument throughout the day, and enjoy magical sunset views in the evening. Luxuriously appointed with elegant furnishings and attentive service, this accommodation offers a once-in-a-lifetime opportunity to experience the world\'s most famous monument from the comfort of your own space.',
                features: ['Taj Mahal view', 'Private balcony', 'Rooftop terrace', 'Luxury furnishings', 'Butler service', 'Guided tours available'],
                host: {
                    name: 'Ravi',
                    rating: 4.99,
                    isSuperhost: true,
                    hostingSince: '6 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'Taj View Suite', beds: '1 king bed', image: 'img12.jpg' },
                    { name: 'Luxury Room', beds: '1 queen bed', image: 'img1.jpg' }
                ],
                maxGuests: 4,
                bedrooms: 2,
                beds: 2,
                bathrooms: 2
            },
            '13': {
                title: 'Riverside Heritage Homestay',
                location: 'Varanasi, Uttar Pradesh',
                price: 30000,
                discount: 5,
                rating: 4.90,
                reviews: 29,
                images: ['img10.jpg', 'img4.avif', 'img8.avif', 'img2.jpg', 'img6.jpg'],
                description: 'Experience the spiritual heart of India from this authentic heritage home overlooking the sacred Ganges River. Watch the mesmerizing riverside rituals from your private balcony, and immerse yourself in the rich cultural tapestry of one of the world\'s oldest living cities. Lovingly restored with traditional elements and modern comforts, this property offers a deeply authentic experience while ensuring your comfort.',
                features: ['Ganges view', 'Heritage building', 'Sunrise boat rides', 'Meditation space', 'Cultural experiences', 'Authentic vegetarian meals'],
                host: {
                    name: 'Sunita',
                    rating: 4.95,
                    isSuperhost: true,
                    hostingSince: '10 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'River View Suite', beds: '1 king bed', image: 'img4.avif' },
                    { name: 'Heritage Room', beds: '1 queen bed', image: 'img8.avif' }
                ],
                maxGuests: 4,
                bedrooms: 2,
                beds: 2,
                bathrooms: 2
            },
            '14': {
                title: 'Tea Estate Cottage with Himalayan Views',
                location: 'Darjeeling, West Bengal',
                price: 24000,
                discount: 0,
                rating: 4.85,
                reviews: 34,
                images: ['img11.jpg', 'img3.avif', 'img7.avif', 'img1.avif', 'img9.jpg'],
                description: 'Nestled within a working tea plantation, this charming cottage offers panoramic views of the majestic Himalayas and rolling tea gardens. Experience life on a tea estate, participate in tea picking, and learn the art of tea making. Wake up to misty mountain sunrises, enjoy walks through the fragrant tea gardens, and relax with a cup of freshly brewed estate tea on your private veranda.',
                features: ['Tea estate location', 'Mountain view', 'Tea experiences', 'Fireplace', 'Hiking trails', 'Organic meals'],
                host: {
                    name: 'Karan',
                    rating: 4.92,
                    isSuperhost: true,
                    hostingSince: '5 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'Mountain View Suite', beds: '1 king bed', image: 'img3.avif' },
                    { name: 'Garden Room', beds: '2 single beds', image: 'img7.avif' }
                ],
                maxGuests: 4,
                bedrooms: 2,
                beds: 3,
                bathrooms: 2
            },
            '15': {
                title: 'Contemporary Apartment with Sabarmati Views',
                location: 'Ahmedabad, Gujarat',
                price: 26000,
                discount: 0,
                rating: 4.88,
                reviews: 26,
                images: ['img12.jpg', 'img6.jpg', 'img1.jpg', 'img5.avif', 'img10.jpg'],
                description: 'Enjoy the perfect blend of modern luxury and cultural richness in this contemporary apartment overlooking the Sabarmati River. Floor-to-ceiling windows frame beautiful river views and flood the stylish interior with natural light. Located in a vibrant neighborhood with easy access to historic sites and modern amenities, this property offers the ideal base for exploring the city\'s unique architectural heritage and thriving cultural scene.',
                features: ['River view', 'Modern design', 'Floor-to-ceiling windows', 'Smart home', 'Building gym', 'Central location'],
                host: {
                    name: 'Meera',
                    rating: 4.94,
                    isSuperhost: true,
                    hostingSince: '4 years hosting',
                    image: 'https://via.placeholder.com/50'
                },
                rooms: [
                    { name: 'River View Master', beds: '1 king bed', image: 'img6.jpg' },
                    { name: 'City View Room', beds: '1 queen bed', image: 'img1.jpg' }
                ],
                maxGuests: 4,
                bedrooms: 2,
                beds: 2,
                bathrooms: 2
            }
        };
        
        // Get the selected property or default to first one
        const property = properties[propertyId] || properties['1'];
        
        // Update document title
        document.title = `${property.title} - Airbnb`;
        
        // Update property title
        const propertyTitle = document.querySelector('.property-heading h1');
        if (propertyTitle) {
            propertyTitle.textContent = property.title;
        }
        
        // Update property basics
        const propertyBasics = document.querySelector('.property-basics h2');
        if (propertyBasics) {
            propertyBasics.textContent = `Entire villa hosted by ${property.host.name}`;
        }
        
        // Update host image
        const hostPhoto = document.querySelector('.host-photo');
        if (hostPhoto) {
            hostPhoto.src = property.host.image;
            hostPhoto.alt = `Host ${property.host.name}`;
        }
        
        // Update gallery images
        updateGalleryImages(property);
        
        // Update property details
        updatePropertyDetails(property);
        
        // Update pricing information
        updatePricing(property);
        
        // Add event listeners for UI interactions
        setupUIInteractions();
    }
    
    function updatePricing(property) {
        // Calculate prices
        const nightlyPrice = property.price;
        const nights = 5; // Default to 5 nights
        const subtotal = nightlyPrice * nights;
        const serviceFee = Math.round(subtotal * 0.18); // Assuming 18% service fee
        const total = subtotal + serviceFee;
        
        // Format as Indian currency with commas
        const formatter = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        
        // Update price in header
        const priceAmount = document.querySelector('.price-amount');
        if (priceAmount) {
            priceAmount.textContent = `₹${nightlyPrice.toLocaleString('en-IN')}`;
        }
        
        // Update rating
        const ratingStars = document.querySelector('.rating-stars');
        const ratingReviews = document.querySelector('.rating-reviews');
        if (ratingStars && ratingReviews) {
            ratingStars.textContent = `★ ${property.rating}`;
            ratingReviews.textContent = `${property.reviews} reviews`;
        }
        
        // Update price breakdown
        const priceRows = document.querySelectorAll('.price-row');
        if (priceRows.length >= 2) {
            // Nightly price row
            const nightlyRow = priceRows[0];
            if (nightlyRow) {
                const label = nightlyRow.querySelector('span:first-child');
                const value = nightlyRow.querySelector('span:last-child');
                if (label && value) {
                    label.textContent = `₹${nightlyPrice.toLocaleString('en-IN')} x ${nights} nights`;
                    value.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
                }
            }
            
            // Service fee row
            const feeRow = priceRows[1];
            if (feeRow) {
                const value = feeRow.querySelector('span:last-child');
                if (value) {
                    value.textContent = `₹${serviceFee.toLocaleString('en-IN')}`;
                }
            }
        }
        
        // Update total
        const totalPrice = document.querySelector('.price-total span:last-child');
        if (totalPrice) {
            totalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
        }
    }
    
    function updateTotalPrice() {
        // Calculate number of nights
        if (selectedCheckIn && selectedCheckOut) {
            const nights = Math.round((selectedCheckOut - selectedCheckIn) / (1000 * 60 * 60 * 24));
            
            // Update the price rows
            const priceRows = document.querySelectorAll('.price-row');
            if (priceRows.length >= 1) {
                const nightlyRow = priceRows[0];
                const label = nightlyRow.querySelector('span:first-child');
                const priceAmount = document.querySelector('.price-amount');
                
                if (label && priceAmount) {
                    const price = parseInt(priceAmount.textContent.replace(/[^\d]/g, ''));
                    const subtotal = price * nights;
                    
                    label.textContent = `₹${price.toLocaleString('en-IN')} x ${nights} nights`;
                    nightlyRow.querySelector('span:last-child').textContent = `₹${subtotal.toLocaleString('en-IN')}`;
                    
                    // Update service fee and total
                    if (priceRows.length >= 2) {
                        const serviceFee = Math.round(subtotal * 0.18);
                        priceRows[1].querySelector('span:last-child').textContent = `₹${serviceFee.toLocaleString('en-IN')}`;
                        
                        const total = subtotal + serviceFee;
                        const totalPrice = document.querySelector('.price-total span:last-child');
                        if (totalPrice) {
                            totalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
                        }
                    }
                }
            }
        }
    }
    
    function setupUIInteractions() {
        // Show more description
        const showMoreBtn = document.querySelector('.show-more');
        if (showMoreBtn) {
            showMoreBtn.addEventListener('click', () => {
                const description = document.querySelector('.description-text p');
                if (description) {
                    description.classList.toggle('expanded');
                    showMoreBtn.textContent = description.classList.contains('expanded') ? 'Show less' : 'Show more';
                }
            });
        }
        
        // Share and save buttons
        const shareBtn = document.querySelectorAll('.action-button')[0];
        const saveBtn = document.querySelectorAll('.action-button')[1];
        
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                alert('Share options would appear here');
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                saveBtn.classList.toggle('saved');
                const heartIcon = saveBtn.querySelector('svg');
                if (heartIcon && saveBtn.classList.contains('saved')) {
                    heartIcon.style.fill = '#FF385C';
                    heartIcon.style.stroke = '#FF385C';
                } else if (heartIcon) {
                    heartIcon.style.fill = 'none';
                    heartIcon.style.stroke = 'currentColor';
                }
                alert(saveBtn.classList.contains('saved') ? 'Property saved to wishlist' : 'Property removed from wishlist');
            });
        }
        
        // Reserve button
        const reserveBtn = document.querySelector('.reserve-button');
        if (reserveBtn) {
            reserveBtn.addEventListener('click', () => {
                alert('Reservation process would start here');
            });
        }
        
        // Date picker and guests dropdown
        const dateInputs = document.querySelectorAll('.date-input');
        dateInputs.forEach(input => {
            input.addEventListener('click', () => {
                calendarContainer.style.display = 'block';
                calendarContainer.style.top = '300px';
                calendarContainer.style.left = '50%';
                calendarContainer.style.transform = 'translateX(-50%)';
                selecting = input.classList.contains('check-in') ? 'checkin' : 'checkout';
            });
        });
        
        const guestsDropdown = document.querySelector('.guests-dropdown');
        if (guestsDropdown) {
            guestsDropdown.addEventListener('click', () => {
                alert('Guests selection would appear here');
            });
        }
        
        // Navigation tabs
        const tabLinks = document.querySelectorAll('.tab-link');
        tabLinks.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                tabLinks.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const targetId = tab.getAttribute('href').substring(1);
                alert(`Would navigate to ${targetId} section`);
            });
        });
        
        // Add event listeners for the new sections
        const showAllAmenitiesBtn = document.querySelector('.show-all-amenities');
        if (showAllAmenitiesBtn) {
            showAllAmenitiesBtn.addEventListener('click', () => {
                alert('All amenities would be displayed in a modal');
            });
        }
        
        const showAllReviewsBtn = document.querySelector('.show-all-reviews');
        if (showAllReviewsBtn) {
            showAllReviewsBtn.addEventListener('click', () => {
                alert('All reviews would be displayed in a modal');
            });
        }
        
        const showMoreLinks = document.querySelectorAll('.show-more-link');
        showMoreLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                alert('Additional information would be displayed in a modal');
            });
        });
        
        const contactHostBtn = document.querySelector('.contact-host-btn');
        if (contactHostBtn) {
            contactHostBtn.addEventListener('click', () => {
                alert('Contact host form would be displayed');
            });
        }
        
        const reportBtn = document.querySelector('.report-btn');
        if (reportBtn) {
            reportBtn.addEventListener('click', () => {
                alert('Report listing options would be displayed');
            });
        }
    }

    // Set up event listeners for calendar
    if (checkInInput && checkOutInput) {
        checkInInput.addEventListener('click', () => {
            calendarContainer.style.display = 'block';
            selecting = 'checkin';
        });

        checkOutInput.addEventListener('click', () => {
            calendarContainer.style.display = 'block';
            selecting = 'checkout';
        });
    }

    if (prevMonthBtn && nextMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            displayedMonth.setMonth(displayedMonth.getMonth() - 1);
            generateCalendar(displayedMonth);
        });

        nextMonthBtn.addEventListener('click', () => {
            displayedMonth.setMonth(displayedMonth.getMonth() + 1);
            generateCalendar(displayedMonth);
        });
    }

    if (clearDatesBtn) {
        clearDatesBtn.addEventListener('click', () => {
            selectedCheckIn = null;
            selectedCheckOut = null;
            updateInputs();
            generateCalendar(displayedMonth);
        });
    }

    if (closeCalendarBtn) {
        closeCalendarBtn.addEventListener('click', () => {
            calendarContainer.style.display = 'none';
        });
    }

    // Close calendar when clicking outside
    document.addEventListener('click', (e) => {
        if (calendarContainer && 
            !calendarContainer.contains(e.target) && 
            (!checkInInput || !checkInInput.contains(e.target)) && 
            (!checkOutInput || !checkOutInput.contains(e.target)) &&
            !e.target.closest('.date-input')) {
            calendarContainer.style.display = 'none';
        }
    });

    // Initialize
    if (calendarGrid) {
        generateCalendar(displayedMonth);
    }
    updateInputs();
    
    // Load property details
    loadPropertyDetails();
});