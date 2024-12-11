# Contact Manager

## Overview

Contact Manager is a simple web application that allows users to manage a list of contacts. The app provides CRUD (Create, Read, Update, Delete) functionality, enabling you to add, edit, delete, and view contacts. Additionally, it allows you to filter contacts by name and tags. The app also includes a form validation system to ensure that input is correct before submission.

## Features

- **Contact Display**: View all saved contacts.
- **CRUD Operations**: Add, edit, and delete contacts.
- **Form Validation**: Ensures that form inputs are properly filled.
- **Filtering**: Filter contacts by name and tags.
- **Tag Management**: Tags that are not used in contacts won't appear in the filtering options after refreshing.

## How It Works

The application displays a list of contacts and provides the ability to filter them by name and tags. It has the following features:

- **Adding contacts**: Allows users to add new contacts with associated tags.
- **Editing contacts**: Users can update information about existing contacts.
- **Deleting contacts**: Remove contacts from the list.
- **Form validation**: Ensures that the form inputs are correct before submission, preventing empty or invalid data.
- **Filtering**: Filters contacts by name and tags, making it easy to find specific contacts.

The logic of the app is divided into the following main files:

1. **`main.js`**: The central file where the app is initialized and logic is managed.
2. **`interface.js`**: Manages the interactions with the user interface, including displaying contacts and handling form events.
3. **`formValidation.js`**: Contains logic to validate form input before submitting contact data.
4. **`dataHandler.js`**: Manages the creation, reading, updating, and deletion of contacts. This file is also responsible for most of the data fetching and manipulation.


## Notes

- Tags that are not used in any contacts will not appear as options for filtering after refreshing the page. This happens because the app does not maintain state for unused tags.
- The app's logic is divided into three main files to help keep the code organized:
    - `main.js`: Manages the app’s core logic.
    - `interface.js`: Handles the user interface.
    - `formValidation.js`: Ensures proper input before submitting data.
    - `dataHandler.js`: Manages all CRUD operations for contacts, and handles the fetching and manipulation of data.
