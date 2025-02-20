# **SSO Dashboard**

Welcome to the **SSO Dashboard**! This project is built using **Next.js 15**, **Firebase**, **ShadCN**, and **Tailwind CSS** to help you set up a simple yet powerful **Single Sign-On (SSO)** dashboard. Follow the instructions below to install, configure Firebase, and run the project locally.

---

## **Requirements**

Before you begin, ensure you have the following installed:

- **[Node.js](https://nodejs.org/en/)** (Recommended version: v16.0 or above)
- **[VS Code](https://code.visualstudio.com/)** (Or any other text editor)
- **[Git](https://git-scm.com/)** (For version control)
- **[Firebase Account](https://firebase.google.com/)**

---

## **Installation Instructions**

### **1. Clone the Repository**

First, clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/sso-dashboard.git
```

### **2. Navigate to the Project Folder**

Once cloned, navigate into the project folder:

```bash
cd sso-dashboard
```

### **3. Install Dependencies**

Run the following command to install the required dependencies:

```bash
npm install
# or
yarn install
```

---

## **Firebase Setup**

### **Steps to Create a Firebase Project:**

1. **Go to Firebase Console:**

   - Open the [Firebase Console](https://console.firebase.google.com/).
   - Click **Add Project** and follow the steps to create a new Firebase project.

2. **Get Firebase Config Values:**
   - After creating your Firebase project, navigate to the **Project Settings** by clicking the gear icon ⚙️ in the top left.
   - Scroll down to the **Your Apps** section and select **Web**.
   - Copy the Firebase config values for your app, including the following:
     - `apiKey`
     - `authDomain`
     - `projectId`
     - `storageBucket`
     - `messagingSenderId`
     - `appId`

### **Set Up Firebase in the Project:**

1. Open the `firebase.ts` file located in the `src` directory.
2. Paste the Firebase config values into the `firebaseConfig` object as shown below:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Paste the values from your Firebase console here
const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

---

### **Firestore Security Rules**

To secure your Firestore database, you need to set up the correct rules.

1. In the Firebase Console, navigate to **Firestore Database**.
2. Go to the **Rules** tab and paste the following rules:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

This ensures that only authenticated users can read and write data.

---

## **Run the Project Locally**

After setting everything up, run the project locally:

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Open your browser and go to [http://localhost:3000](http://localhost:3000) to view your **SSO Dashboard**!

---

## **Troubleshooting**

If you face any issues, here are some things you can try:

- Double-check that your Firebase config in `firebase.ts` is correct.
- Ensure that all dependencies are installed by running `npm install` or `yarn install` again.
- If the app doesn’t load, restart the server with `npm run dev` or `yarn dev`.

---

## **Firebase Authentication Integration**

This project is designed to authenticate users using Firebase Authentication. You can enable **Google**, **GitHub**, or **Email/Password** authentication for users.

### **Firebase Auth Setup**

1. Go to **Firebase Console** > **Authentication** > **Sign-in method**.
2. Enable the sign-in providers you want to use, such as **Google**, **GitHub**, or **Email/Password**.
3. Firebase will handle the authentication flow, and users will be able to log in to your dashboard.

---

## **License**

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---

## **Contributing**

Feel free to contribute to this repository by forking and submitting pull requests. Here's how you can get started:

1. Fork the repository.
2. Clone your forked repo to your local machine.
3. Make your changes and commit them.
4. Push your changes and create a pull request.

---

## **Acknowledgments**

- **Next.js 15** for building an amazing framework.
- **Firebase** for providing powerful tools to manage authentication and databases.
- **Tailwind CSS** for making styling a breeze.
- **ShadCN** for helping with UI components.
