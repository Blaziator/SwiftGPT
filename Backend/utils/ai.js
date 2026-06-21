import "dotenv/config";

const getAIApiResponse = async (messages) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages
    })
  };

  try{
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
    const data = await response.json();
    if (!response.ok) {
      console.log("Status:", response.status);
      console.log("Data:", data);
      throw new Error(data.error?.message || "Groq API Error");
    }
    return data.choices[0].message.content;
  }catch(err){
    console.log(err);
    throw err;
  }
};    

export default getAIApiResponse;