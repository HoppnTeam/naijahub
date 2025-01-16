import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Briefcase, ShoppingBag, Award, BookOpen, Building2, FileText } from "lucide-react";
import { Post } from "@/types/post";
import { BackNavigation } from "@/components/BackNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const Business = () => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const navigate = useNavigate();

  const { data: subcategories } = useQuery({
    queryKey: ["business-subcategories"],
    queryFn: async () => {
      const { data: businessCategory } = await supabase
        .from("categories")
        .select("id")
        .eq("name", "Business")
        .single();

      if (!businessCategory) return [];

      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("parent_id", businessCategory.id);

      return data || [];
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["business-posts", selectedSubcategory],
    queryFn: async () => {
      const query = supabase
        .from("posts")
        .select(`
          *,
          profiles:profiles!posts_user_id_profiles_fkey (username, avatar_url),
          categories:categories!posts_category_id_fkey (name),
          likes (count),
          comments (count)
        `)
        .eq("categories.name", "Business")
        .order("created_at", { ascending: false });

      if (selectedSubcategory !== "all") {
        query.eq("subcategory_id", selectedSubcategory);
      }

      const { data } = await query;
      
      return data?.map(post => ({
        ...post,
        _count: {
          likes: post.likes?.[0]?.count || 0,
          comments: post.comments?.[0]?.count || 0
        }
      })) as Post[];
    },
  });

  const handleCreatePost = () => {
    const businessCategory = posts?.[0]?.category_id;
    navigate("/create-post", {
      state: { category: "Business", categoryId: businessCategory },
    });
  };

  const businessResources = [
    {
      title: "Government Resources",
      icon: <Building2 className="w-5 h-5" />,
      items: [
        { name: "CAC Business Registration Guide", link: "#" },
        { name: "FIRS Tax Compliance", link: "#" },
        { name: "Export Documentation", link: "#" }
      ]
    },
    {
      title: "Business Guides",
      icon: <FileText className="w-5 h-5" />,
      items: [
        { name: "Starting a Business in Nigeria", link: "#" },
        { name: "SME Funding Options", link: "#" },
        { name: "Business Plan Templates", link: "#" }
      ]
    },
    {
      title: "Institutional Support",
      icon: <Award className="w-5 h-5" />,
      items: [
        { name: "SMEDAN Resources", link: "#" },
        { name: "BOI Loan Programs", link: "#" },
        { name: "NEXIM Bank Services", link: "#" }
      ]
    }
  ];

  return (
    <div className="container py-8">
      <BackNavigation />
      <div className="flex items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <Briefcase className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Business Hub</h1>
        </div>
        <Button onClick={handleCreatePost}>Create Post</Button>
      </div>

      <Tabs defaultValue="all" value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
        <TabsList className="w-full mb-6">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          {subcategories?.map((subcategory) => (
            <TabsTrigger key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedSubcategory}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="grid grid-cols-1 gap-6">
                {posts?.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-card rounded-lg p-6 sticky top-6 space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5" />
                  <h2 className="text-xl font-semibold">Business Resources</h2>
                </div>
                
                {businessResources.map((section, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {section.icon}
                      <h3 className="font-medium">{section.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <a 
                            href={item.link}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Business;