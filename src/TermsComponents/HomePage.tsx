import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Code, Target, Clock } from "lucide-react";
import type { SessionDuration } from "@/lib/types";
import { categories } from "@/lib/terms";

interface HomePageProps {
  onStart: (category: string, duration: SessionDuration) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedDuration, setSelectedDuration] =
    React.useState<SessionDuration>(60);

  const durations: { value: SessionDuration; label: string }[] = [
    { value: 30, label: "30 seconds" },
    { value: 60, label: "1 minute" },
    { value: 120, label: "2 minutes" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Code className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">DevType</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Type developer terms in random sentences. Practice coding vocabulary
            while improving your typing speed!
          </p>
        </div>

        {/* Preview Example */}
        <Card className="mb-8 bg-gray-50">
          <CardContent className="pt-6">
            <p className="text-center font-mono text-lg text-gray-700">
              The <span className="bg-yellow-200 px-1 rounded">component</span>{" "}
              uses <span className="bg-yellow-200 px-1 rounded">async</span>{" "}
              functions to fetch data from the{" "}
              <span className="bg-yellow-200 px-1 rounded">api</span> endpoint.
            </p>
            <p className="text-center text-sm text-gray-500 mt-2">
              Type the highlighted developer terms as they appear!
            </p>
          </CardContent>
        </Card>

        {/* Setup */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Choose Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    className="justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                    <Badge variant="secondary" className="ml-auto">
                      {category === "All"
                        ? "15"
                        : category === "JavaScript"
                        ? "3"
                        : category === "React"
                        ? "3"
                        : category === "Frontend"
                        ? "3"
                        : category === "Backend"
                        ? "3"
                        : category === "Interview"
                        ? "3"
                        : "0"}{" "}
                      terms
                    </Badge>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Duration Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Session Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {durations.map((duration) => (
                  <Button
                    key={duration.value}
                    variant={
                      selectedDuration === duration.value
                        ? "default"
                        : "outline"
                    }
                    className="w-full justify-start text-lg py-6"
                    onClick={() => setSelectedDuration(duration.value)}
                  >
                    {duration.label}
                  </Button>
                ))}

                <Button
                  size="lg"
                  className="w-full mt-6"
                  onClick={() => onStart(selectedCategory, selectedDuration)}
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Typing Practice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">🎯 Typing Rules</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Type the highlighted developer terms</li>
                  <li>• Press SPACE or Skip to move to next word</li>
                  <li>• Focus on accuracy over speed</li>
                  <li>• New sentences generate automatically</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💡 Features</h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Hover over completed words for definitions</li>
                  <li>• Real-time WPM and accuracy tracking</li>
                  <li>• Timer-based sessions</li>
                  <li>• Category-specific practice</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
