import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;
let reviews;

function isValidHex(str) {
    return /^[0-9A-Fa-f]{24}$/.test(str);
}

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (!reviews) {
            try {
                reviews = await conn.db(process.env.MOVIEREVIEWS_NS).collection('reviews');
            } catch (e) {
                console.error(`unable to establish connection handle in reviewDAO: ${e}`);
            }
        }
    }

    static async addReview(movieId, user, review, date) {
        if (!isValidHex(movieId)) {
            console.error(`Invalid ID format for movieId: ${movieId}`);
            return { error: "Invalid ID format", movieId };
        }
        try {
            return await reviews.insertOne({
                name: user.name,
                user_id: user._id,
                date,
                review,
                movie_id: new ObjectId(movieId)
            });
        } catch (e) {
            console.error(`unable to post review: ${e}`);
            return { error: e };
        }
    }

    static async updateReview(reviewId, userId, review, date) {
        try {
            return await reviews.updateOne(
                {user_id: userId, _id: new ObjectId(reviewId)},
                {$set: {review: review, date: date}}
            );
        }
        catch (e) {
            console.error(`unable to update review: ${e}`);
            return { error: e };
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                user_id: userId,
            });
            return deleteResponse;
        }
        catch (e) {
            console.error(`unable to delete review: ${e}`);
            return { error: e };
        }
    }

}