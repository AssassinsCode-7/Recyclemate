# Project Name: ScrapLink - Connecting Recyclers and Collectors

## Technologies Used
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Firebase (Authentication, Firestore Database)
- **Libraries/Frameworks:** Leaflet.js (for map rendering)
- **APIs:** OpenStreetMap/Nominatim API (for location search)
- **Deployment Platform:** GitHub Pages / Firebase Hosting

## Project Description
**ScrapLink** aims to provide a seamless connection between individuals and nearby scrap collectors, facilitating faster interactions and scheduling.
By ensuring that users can find collectors quickly and easily, we enhance the efficiency of recycling efforts and prevent waste accumulation.
The platform will motivate users to participate through a rewarding system that offers points for recycling activities, addressing their needs while encouraging sustainable practices.
By balancing the users' desire for rewards with their need for efficient waste management, we create a mutually beneficial ecosystem for both collectors and recyclers.

## API References
- **[OpenStreetMap API](https://www.openstreetmap.org/)** - Used for map rendering.
- **[Nominatim API](https://nominatim.org/release-docs/develop/api/Search/)** - Used for location search functionality.
- **Firebase** - Authentication and database are powered by Firebase. No additional API keys are required as Firebase setup is already provided in the project.

## Demo Video
Watch a quick demo of ScrapLink on [OneDrive](https://amritauniv-my.sharepoint.com/:f:/g/personal/am_en_u4aie22155_am_students_amrita_edu/EtPOM_uoMEFNgE-edrsl7ZcBNmwc5w3DOdvRliqpInUdjw?e=if7yxt) to see the platform in action.

## Installation and Setup
To set up ScrapLink locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/scraplink.git
   cd scraplink
   ```

2. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Go to **Project Settings > General > Your Apps**, and add a new web app.
   - Copy the Firebase configuration code and replace it in `script.js`.
   - Enable **Authentication** and **Firestore Database** in your Firebase console.

3. **Install Dependencies:**
   Ensure you have `npm` installed to set up Firebase tools if necessary:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

4. **Run Locally:**
   Open `index.html` in a browser. If you’re using Firebase Hosting for deployment, you can serve the app locally:
   ```bash
   firebase serve
   ```

## Deployment Link
Access the live version of ScrapLink here: [ScrapLink Live](https://assassinscode-7.github.io/scraplink)

## Future Scope
Potential enhancements include:
- **Advanced Sorting**: Adding AI to automatically classify uploaded images of scrap.
- **In-app Messaging**: Enabling chat between users and collectors.
- **Dynamic Collector Updates**: Real-time location updates for collectors.
- **Extended Rewards**: Incorporating more engaging rewards for users based on recycling milestones.
