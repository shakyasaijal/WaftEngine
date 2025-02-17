const express = require('express');
const router = express.Router();
const fileUpload = require('../../helper/upload.helper')('public/blog/');
const uploader = fileUpload.uploader;

const blogModule = require('../../modules/blog/blogController');
const { authorization, authentication } = require('../../middleware/authentication.middleware');
const { catSanitize, catValidate, sanitize, validate } = require('../../modules/blog/blogValidation');

router.get('/auth', authorization, authentication, blogModule.GetBlogAuthorize);
router.get('/', blogModule.GetBlogUnauthorize);
router.get('/latest', blogModule.getLatestBlog);
router.get('/related/:slug_url', blogModule.getRealtedBlog);
router.get('/category', blogModule.GetBlogCategory);
router.get('/category/:slug', blogModule.GetBlogCatBySlug);
router.get('/:id', authorization, blogModule.GetBlogDetail);
router.get('/blog/:slug_url', blogModule.GetBlogBySlug);
router.get('/blogbycat/:id', blogModule.GetBlogByCat);
router.get('/blogbytag/:tag', blogModule.GetBlogByTag);
router.get('/blogbyauthor/:author', blogModule.GetBlogByAuthor);
router.get('/blogbytime/:time', blogModule.GetBlogByDate);
router.post('/', authorization, authentication, uploader.single('file'), sanitize, validate, blogModule.SaveBlog);
router.post('/category', authorization, authentication, uploader.single('file'), catSanitize, catValidate, blogModule.SaveBlogCategory);
router.delete('/:id', authorization, authentication, blogModule.DeleteBlog);
router.delete('/category/:id', authorization, authentication, blogModule.DeleteBlogCat);

module.exports = router;
