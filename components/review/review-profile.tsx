import React, { useEffect, useState } from "react";
import { OpenAI } from "openai";
import LoadingCircle from "../shared/icons/loading-circle";

type DisplayReviewProfileProps = {
  image: string;
};

const DisplayReviewProfile: React.FC<DisplayReviewProfileProps> = ({
  image,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [reviewData, setReviewData] = useState({
    rating: {
      generalAppearance: 0,
      firstImpression: 0,
      attractiveness: 0,
      average: 0,
    },
    feedback: {
      positive: "",
      negative: "",
      suggestions: [""],
    },
  });

  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const reviewUserDatingProfile = async (image: string) => {
    const responseReviewProfile = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 2000,
      messages: [
        {
          role: "system",
          content: `Objective: Conduct a culturally sensitive and exhaustive analysis of a dating profile presented as an image. The analysis will evaluate both textual and visual content against specific criteria, with a focus on respect, inclusivity, and encouragement. Feedback must be structured in JSON format for clarity and programmability, ensuring a consistently friendly and approachable tone.

                  Analysis Procedure:

                  1. Cultural Sensitivity Acknowledgement: Begin the analysis by recognizing the diverse cultural backgrounds that influence personal presentation and communication in dating profiles. Emphasize an approach grounded in respect and encouragement, aiming to provide feedback that is sensitive to cultural nuances and personal identities.

                  2. In-depth Content Extraction and Evaluation:
                    - Extract and analyze profile texts (e.g., biography, hobbies, interests) and visual elements (e.g., profile photos, background images), with an emphasis on understanding cultural contexts and personal expressions.
                    - Assess the content's relevance, appropriateness, and alignment with the intended audience from a culturally informed perspective, offering detailed commentary on each aspect.

                  3. Detailed Evaluation Criteria:
                    - Rate aspects such as General Appearance, First Impression, and Attractiveness on a 0-10 scale, including considerations of cultural presentation norms, providing detailed reasons for each score.
                    - Evaluate the synergy between text and visuals, focusing on clarity, cultural relevance, and effectiveness in conveying the profile owner's personality and interests.

                  4. Comprehensive Feedback Generation:
                    - Offer an extensive summary of strengths and areas for improvement, with actionable feedback. Include considerations for cultural and personal identity expression, ensuring the profile owner receives insightful and respectful suggestions.
                    - Propose improvements for enhancing the profile's text quality, visual appeal, and overall presentation, with an emphasis on cultural sensitivity and personal authenticity.

                  Mandatory Output Format (JSON Only):
                  If the submitted image is valid and the analysis can be performed, the feedback and findings must be formatted as a JSON object according to the schema below. If the image is invalid (e.g., unreadable, irrelevant to a dating profile), set all JSON values to null to indicate that the analysis cannot proceed.

                  {
                    "rating": {
                      "generalAppearance": "Score in a scale of 1-10 or null",
                      "firstImpression": "Score in a scale of 1-10 or null",
                      "attractiveness": "Score in a scale of 1-10 or null",
                      "average": "Overall calculated score or null"
                    },
                    "feedback": {
                      "positive": "Extensive summary of strengths with detailed examples or null",
                      "negative": "In-depth discussion of areas needing improvement, with specific examples or null",
                      "suggestions": "Detailed and actionable suggestions for profile enhancement, with a focus on clarity and impact or null"
                    }
                  }
                  `,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Please review this dating profile" },
            {
              type: "image_url",
              image_url: {
                url: "https://res.cloudinary.com/dp04mqgzv/image/upload/v1708858762/dating-app/av9q28nvi9o0da5mgyyf.png",
              },
            },
          ],
        },
        {
          role: "assistant",
          content: `
            {
              "rating": {
                "generalAppearance": "8",
                "firstImpression": "7",
                "attractiveness": "7",
                "average": "7.3"
              },
              "feedback": {
                "positive": "The profile picture is a high-quality image that shows a clear view of your face, making it easy for potential matches to see who you are. Your bio is witty and references pop culture, which can be a great conversation starter and shows your sense of humor and personality.",
                "negative": "The text, while humorous, could potentially overwhelm those not familiar with the references, making it less accessible to a broader audience. The profile might benefit from a bit more personal detail or anecdote that doesn't rely on pop culture knowledge.",
                "suggestions": "Consider balancing the pop culture references with more universal details about yourself that can appeal to those who might not understand the references. For instance, you could mention a personal hobby or an interesting fact about yourself. Also, adding another photo or two that showcases more of your daily life or interests could provide a more rounded picture of who you are."
              }
            }
          `,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Please review my dating profile" },
            {
              type: "image_url",
              image_url: {
                url: "https://res.cloudinary.com/dp04mqgzv/image/upload/v1708919450/dating-app/gkxij.png",
              },
            },
          ],
        },
        {
          role: "assistant",
          content: `
            {
              "rating": {
                "generalAppearance": "7",
                "firstImpression": "8",
                "attractiveness": "7",
                "average": "7.3"
              },
              "feedback": {
                "positive": "The profile picture is bright and inviting, featuring a genuine smile that conveys warmth and friendliness. The natural daylight setting is pleasant and makes for a clear image. The inclusion of interests such as 'Dog lover' and 'Tea' add a personal touch that can resonate with like-minded individuals.",
                "negative": "While the photo is welcoming, it includes sunglasses which can obscure a crucial connection point, the eyes. The profile text is concise but misses the opportunity to tell more about your personality or what makes you unique.",
                "suggestions": "Consider using a photo where your eyes are visible, as this can enhance trust and connection with viewers. Expanding on your bio to include what you enjoy about your work in the medical field or why you're passionate about your hobbies could enrich your profile. Adding a bit about what you value in a relationship or partner could also give potential matches better insight into what you're looking for."
              }
            }
          `,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Please review this dating profile" },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
    });

    const responseFormatting = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 2000,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Transform the provided input string into a well-formatted JSON object following a specific schema. The input string will contain ratings and feedback related to general appearance, first impression, attractiveness, along with positive and negative feedback, and suggestions for improvement.

                  Input Description: The input string will consist of numerical ratings for general appearance, first impression, attractiveness, and an overall average rating. Additionally, it will include a positive feedback sentence, a negative feedback sentence, and a list of suggestions for improvement. Each piece of information will be separated by semicolons.

                  Output Format Specification: The output should be a JSON object structured as follows:

                  {
                    "rating": {
                      "generalAppearance": number | null,
                      "firstImpression": number | null,
                      "attractiveness": number | null,
                      "average": number | null
                    },
                    "feedback": {
                      "positive": string | null,
                      "negative": string | null,
                      "suggestions": string[] | null
                    }
                  }
                  `,
        },
        {
          role: "user",
          content: `${responseReviewProfile.choices[0].message.content}`,
        },
      ],
    });

    setReviewData(JSON.parse(responseFormatting.choices[0].message.content!));
    setIsLoading(false);
  };

  useEffect(() => {
    if (image) reviewUserDatingProfile(image);
  }, [image]);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-52 w-full items-center justify-center rounded-lg bg-white px-4 py-8 shadow-lg">
        <LoadingCircle />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full rounded-lg bg-white px-4 py-8 shadow-lg">
      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-2xl font-bold text-gray-800">Ratings</h3>
          <div className="flex flex-col gap-1 text-gray-600">
            <p>
              First Impression:{" "}
              <span className="font-semibold text-gray-800">
                {reviewData.rating.firstImpression}
              </span>
            </p>
            <p>
              Attractiveness:{" "}
              <span className="font-semibold text-gray-800">
                {reviewData.rating.attractiveness}
              </span>
            </p>
            <p>
              General Apperance:{" "}
              <span className="font-semibold text-gray-800">
                {reviewData.rating.generalAppearance}
              </span>
            </p>
            <p>
              Overall Average:{" "}
              <span className="font-semibold text-gray-800">
                {reviewData.rating.average}
              </span>
            </p>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-2xl font-bold text-gray-800">Feedback</h3>
          <div className="text-gray-600">
            <p>
              Positive:{" "}
              <span className="font-semibold text-green-500">
                {reviewData.feedback.positive}
              </span>
            </p>
            <p>
              Negative:{" "}
              <span className="font-semibold text-red-500">
                {reviewData.feedback.negative}
              </span>
            </p>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-2xl font-bold text-gray-800">Suggestions</h3>
          <ul className="list-inside list-disc text-gray-600">
            {reviewData.feedback.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default DisplayReviewProfile;
