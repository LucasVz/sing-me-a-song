import supertest from "supertest";
import app from "../../src/app.js"
import { prisma } from "../../src/database.js"
import { faker } from "@faker-js/faker";

describe("GET /recommendations", () =>{
    beforeEach(truncateUsers);
    afterAll(disconnect);

    it("shouold return recommendation", async() =>{
        const recommendation= {
            name: faker.internet.userName(),
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        }

        await prisma.recommendation.create({
            data: recommendation
        });

        const response = await supertest(app).get("/recommendations");

        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(1);
    });

    it("shouold return random recommendation", async() =>{
        const recommendation= {
            name: faker.internet.userName(),
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        }

        const randomRecommendation = await prisma.recommendation.create({
            data: recommendation
        });

        const response = await supertest(app).get("/recommendations/random");

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(randomRecommendation);
    });

    it("shouold return recommendation by id", async() =>{
        const recommendation= {
            name: faker.internet.userName(),
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        }

        const recommendationById = await prisma.recommendation.create({
            data: recommendation
        });

        const response = await supertest(app).get(`/recommendations/${recommendationById.id}`);

        expect(response.status).toEqual(200);
        expect(response.body).toEqual(recommendationById);
    });

    it("shouold return top recommendation", async() =>{
        const amount = 2

        const recommendation1= {
            name: faker.internet.userName(),
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
            score:1
        }

        const recommendation2= {
            name: faker.internet.userName(),
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
            score:5
        }
        
        await prisma.recommendation.createMany({
            data: [
                recommendation1,
                recommendation2
            ],
          });


          const response = await supertest(app).get(`/recommendations/top/${amount}`);

          expect(response.body.length).toEqual(amount);
          expect(response.body[0].score).toEqual(5);
    });
});

describe("POST /recommendations", () =>{
    beforeEach(truncateUsers);
    afterAll(disconnect);

    it("shouold return status 201 and given valid recommendation", async() =>{
        const recommendation= {
            name: faker.internet.userName(),
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        }

        const response = await supertest(app).post(`/recommendations`).send(recommendation);
        const findRecommendation = await prisma.recommendation.findMany({});

        expect (findRecommendation.length).toEqual(1)
        expect(response.status).toEqual(201);

    });
});

describe("POST /upvote", () =>{
    beforeEach(truncateUsers);
    afterAll(disconnect);

    it(" shouold return status 201 and upvote +1", async() =>{
        const recommendation= {
            name: faker.internet.userName(),
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        }

        const createdRecommendation = await prisma.recommendation.create({
            data: recommendation,
        });

        const response = await supertest(app).post(`/recommendations/${createdRecommendation.id}/upvote`);

        expect(response.status).toEqual(200);

    });
});

describe("POST /downvote", () =>{
    beforeEach(truncateUsers);
    afterAll(disconnect);

    it(" shouold return status 201 and downvote -1", async() =>{
        const recommendation= {
            name: faker.internet.userName(),
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        }

        const createdRecommendation = await prisma.recommendation.create({
            data: recommendation,
        });

        const response = await supertest(app).post(`/recommendations/${createdRecommendation.id}/downvote`);

        expect(response.status).toEqual(200);

    });
});


async function disconnect() {
    await prisma.$disconnect();
}

async function truncateUsers() {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
}