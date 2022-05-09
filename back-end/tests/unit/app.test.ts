import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { jest } from "@jest/globals";
import { faker } from "@faker-js/faker";
import { Recommendation } from '@prisma/client';

const not_found = {
    message: "",
    type: "not_found",
};

const conflict = {
    message: "Recommendations names must be unique",
    type: "conflict",
};

describe("service /insert", () =>{
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should return conflict Recommendations names must be unique", async() =>{
        const recommendation:any = {
            id: 1,
            name: faker.name.findName(),
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
        }

        jest.spyOn(recommendationRepository, "findByName").mockReturnValue(recommendation);

        expect(async () => {
            await recommendationService.insert(recommendation)
        }).rejects.toEqual(conflict);
    });
});

describe("service /upvote", () =>{
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it("should return not_found if no recommendation", async() =>{
        jest.spyOn(recommendationRepository, "find").mockReturnValue(null);

        expect(async () => {
            await recommendationService.upvote(1)
        }).rejects.toEqual(not_found);
    });
});

describe("service /downvote", () =>{
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    it("should return not_found if no recommendation ", async() =>{
        jest.spyOn(recommendationRepository, "find").mockReturnValue(null);

        expect(async () => {
            await recommendationService.downvote(1)
        }).rejects.toEqual(not_found);
    });

    it("shouold delete recommendation if score < -7", async() =>{
        const recommendation:any = {
            name: faker.internet.userName(),
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
            score:-7
        }

        jest.spyOn(recommendationRepository, "find").mockReturnValue(recommendation);
        jest.spyOn(recommendationRepository, "updateScore").mockResolvedValue(recommendation);
        const removeRecommendation = jest.spyOn(recommendationRepository, "remove").mockResolvedValue(null);

        await recommendationService.downvote(1);

        expect(removeRecommendation).toHaveBeenCalledTimes(1);
    });
});

describe("service /getByScore", () =>{
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it(" should return recommendation by score", async() =>{
        const recommendation:Recommendation = {
            id: 1,
            name: faker.name.findName(),
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
            score: 10
        }
        
        jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([recommendation]);

        const result = await recommendationService.getByScore("gt");
        expect(result).toEqual([recommendation]);
    });

    it(" should return recommendation by filter gt", async() =>{
        
        const result = jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

        await recommendationService.getByScore("gt");
        expect(result).toBeCalledWith({ score: 10, scoreFilter: "gt" })
    });


    it(" should return recommendation by filter lte", async() =>{

        const result = jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

        await recommendationService.getByScore("lte");
        expect(result).toBeCalledWith({ score: 10, scoreFilter: "lte" })
    });

    it(" should return recommendation by score", async() =>{
        const recommendation:Recommendation = {
            id: 1,
            name: faker.name.findName(),
            youtubeLink: 'https://www.youtube.com/watch?v=chwyjJbcs1Y',
            score: 10
        }
        
        jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([recommendation]);

        const result = await recommendationService.getByScore("gt");
        expect(result).toEqual([recommendation]);
    });

    it(" should return not_found if no recommendation", async() =>{
        
        jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([null]);

        expect(async () => {
            await recommendationService.getByScore("gt")
        }).rejects.toEqual(not_found);
    });
});

describe("service /getByScoreFilter", () =>{
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it(" should return lte", () =>{
        
        const result = recommendationService.getScoreFilter(0.8);

        expect(result).toBe("lte");
    });

    it(" should return gt", () =>{
        
        const result = recommendationService.getScoreFilter(0.6);

        expect(result).toBe("gt");
    });
});

describe("service /random", () =>{
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it(" should return not_found if no recommendation", async() =>{
        jest.spyOn(recommendationService, "getScoreFilter").mockReturnValue("gt");
        jest.spyOn(recommendationService, "getByScore").mockResolvedValue([]);
        jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);

        expect(async () => {
            await recommendationService.getRandom();
        }).rejects.toEqual(not_found);
    });
});