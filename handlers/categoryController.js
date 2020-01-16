const models = require('../models')

module.exports.getCategories = async function (req,res) {

  let categories = await models.Categories.findAll()

  let aPost = await models.Posts.findAll({
    include:
    [
      {

        model: models.PostsWithCategories,
          include:[
          {
            model: models.Categories,
            as: 'category'
          }
          ],

          as: 'postswithcategories'
  
      }, {

        model: models.Categories,
        as: 'category'

      },
      {
        model:models.Users,
        as: 'user'
      }

    ]
})

let categoryId = req.params.categoryId
  let category = await models.Categories.findAll({
      include:[
          {
              model:models.PostsWithCategories,
              include:[
                {
                model:models.Posts,
                include:[
                {
                  model: models.Users,
                  as: "user"
                },
                {
                  model: models.PostImage,
                  as: 'postImage'
                }
              ],
                as:'post'
                },
              ],
              as: 'postswithcategories'
          }
      ],
      where:{
           category:categoryId
       }
  })

  for(let i = 0; i < category.postswithcategories.length; i++){
    let likes = await models.Notifications.findAll({
      where: {
        post_id: category.postswithcategories[i].id,
        type: 'like'
      }
    })

    category.postswithcategories[i].likes = likes

    //finds if user liked post
    let liked = await models.Notifications.findOne({
      where: {
        user_id: user_id.id,
        type: 'like',
        post_id: category.postswithcategories[i].id
      }
    })

    category.postswithcategories[i].liked = liked

    //determines which button to show
    if(liked != null) {
      category.postswithcategories[i].hideAdd = 'hidden'
    } else {
      category.postswithcategories[i].hideRemove = 'hidden'
    }
  }

  res.render('category',{categories:categories,aPost:aPost,category:category,postswithcategories:category.postswithcategories,post:category.post,user:category.user})
