// const fetch = require('node-fetch');

let cachedCategories = [];

const fetchCategories = async () => {
    try {
        const response = await fetch('https://opentdb.com/api_category.php');
        const data = await response.json();
        cachedCategories = data.trivia_categories || [];
        console.log('Categories fetched and cached successfully.');
    } catch (error) {
        console.error('Failed to fetch categories:', error.message);
    }
};

// Fetch categories when the server starts
fetchCategories();

// Controller to get categories
const getCategories = (req, res) => {
    res.json({ categories: cachedCategories });
};

module.exports = { getCategories };
