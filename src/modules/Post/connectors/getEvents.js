import Sequelize from 'sequelize'
const Op = Sequelize.Op

export default function (Post) {
  return function() {
    const orderBy = ['menu_order', 'ASC']
    const where = {
      post_status: 'publish',
      post_type: {
        [Op.in]: ['wp_event']
      }
    }

    return Post.findAll({
      where: where,
    }).then(r => {
      return r
    })
  }
}