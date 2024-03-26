class PlaceDTO {
    constructor(placeId, address, category, phone, googleUrl, bizWebsite, storeName, ratingText, stars, numberOfReviews) {
        this.placeId = placeId;
        this.address = address;
        this.category = category;
        this.phone = phone;
        this.googleUrl = googleUrl;
        this.bizWebsite = bizWebsite;
        this.storeName = storeName;
        this.ratingText = ratingText;
        this.stars = stars;
        this.numberOfReviews = numberOfReviews;
    }
}

export default PlaceDTO;