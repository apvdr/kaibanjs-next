import { Agent, Task, Team } from 'kaibanjs';
import { TavilySearchResults } from '@langchain/community/tools/tavily_search';
import { ChatGroq } from "@langchain/groq";

const groqModel = new ChatGroq({
  model: "llama-3.1-8b-instant",
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
});

// Define the search tool used by the Research Agent
const searchTool = new TavilySearchResults({
  maxResults: 5,
  apiKey: process.env.NEXT_PUBLIC_TRAVILY_API_KEY
});

// Define the Research Agent
const researchAgent = new Agent({
    name: 'Bruno - Researcher',
    role: 'News Researcher',
    //goal: 'Search the internet including google, youtube, MIT, Deep Learning, AI Valley, The AI Break, The Neuron, AI Breakfast and summarize the latest news of week on a given topic',
    goal: 'Search the internet and summarize the latest news of week on a given url',
    background: 'Experienced in data analysis and information gathering',
    tools: []
  });

  const researchTask = new Task({
    title: 'Latest news research',
    description: 'Research the latest news on the topic: {topic}',
    expectedOutput: 'A summary of the latest news and key points on the given topic',
    agent: researchAgent
  });
  
  // Define the Writer Agent
  const writerAgent = new Agent({
    name: 'Vitor - Writer',
    role: 'Content Creator',
    goal: 'Create engaging blog posts based on provided information',
    background: 'Skilled in writing and content creation',
    tools: []
  });

  const writingTask = new Task({
    title: 'Blog post writing',
    description: 'Write a blog post about {topic} based on the provided research',
    expectedOutput: 'An engaging blog post summarizing the latest news on the topic in Markdown format',
    agent: writerAgent
  });

  const formaterAgent = new Agent({
    name: 'Eraide - Formater',
    role: 'Content Formater',
    goal: 'Format the content to required way.',
    background: 'Skilled in formating content',
    tools: []
  });

  const formaterTask = new Task({
    title: 'Formatting Blog post',
    description: 'Format the blog post about {topic}',
    expectedOutput:`3 areas each one with a related icon, 
                    the first one is always the Rundown a summary of the article.
                    The second one is The Details providing most relevant information about that topic and news formated in bullet points and\
                    finally the third one is the why it matters providding the impact or importance of that news.
                    you must be more detail in second area and third area.
                    show the result in markdow format.
                    Translate the result to Brazilian Portuguese.
                    
                    as example:  
                    💡 The Rundown:

                    MIT researchers have developed an AI system capable of mimicking human vocal imitations of everyday sounds, such as animal noises or sirens. This breakthrough allows AI to replicate sounds and interpret human attempts at sound mimicry with no prior training.

                    🔍 The Details:

                    The system models the human vocal tract and uses a cognitively inspired algorithm to generate sound imitations.
                    Examples include recreating sounds like a snake's hiss or an ambulance siren.
                    It can also analyze human vocal imitations to identify corresponding real-world sounds.
                    This innovation bridges human vocal communication and AI sound synthesis, enabling a new level of interaction.

                    🤔 Why It Matters:

                    This advancement could transform industries by:

                    Enhancing tools for sound design in entertainment and media.
                    Improving the realism of AI-driven characters and voice assistants.
                    Supporting language learning and accessibility tools by enabling better auditory learning experiences.
                    The ability to replicate and understand sounds like humans do opens up new possibilities for AI-human interaction.`,
    
                    //use the icon 📌 in second area. use the icon 💡 in first area. use the incon 🤔 in third area.
                    agent: formaterAgent
  });

  const tranlaterAgent = new Agent({
    name: 'Laisa - Translator',
    role: 'Content Translator',
    goal: 'Translate the content on provided information',
    background: 'Skilled in translating content',
    tools: []
  });

  const translateTask = new Task({
    title: 'Translate content',
    description: 'Translate the content to Brazilian Portuguese',
    expectedOutput: 'A final document translated to Brazilian Portuguese',
    agent: researchAgent
  });

  // Create the Team
const blogTeam = new Team({
    name: 'AI News Blogging Team',
    agents: [researchAgent, writerAgent, formaterAgent,],
    tasks: [researchTask, writingTask, formaterTask],
    inputs: {
        topic: 'AI Trends',
    },
    env: { OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY }
    // env: { COHERE_API_KEY: process.env.VITE_COHERE_API_KEY }
  });
  
  export { blogTeam };