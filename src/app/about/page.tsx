import Image from 'next/image';
import { Mail, Facebook, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function AboutPage() {
  // Replace with your actual image path
  const profileImagePath = "https://picsum.photos/seed/adel-profile/128/128";

  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 mb-4 relative">
                <Image
                  src={profileImagePath}
                  alt="Adel Azeez Jabbour profile picture"
                  data-ai-hint="profile picture"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <CardTitle className="text-3xl">Adel Azeez Jabbour</CardTitle>
              <p className="text-muted-foreground">Computer Networks and Systems Engineer</p>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2 pt-4">
               <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <a href="mailto:adelazeez98@gmail.com" className="hover:text-primary">
                    adelazeez98@gmail.com
                  </a>
              </div>
              <div className="flex gap-4 mt-2">
                <Button variant="outline" asChild>
                  <Link href="https://facebook.com/adel.azeez.ja" target="_blank" rel="noopener noreferrer">
                    <Facebook className="mr-2 h-4 w-4" /> Facebook
                  </Link>
                </Button>
                 <Button variant="outline" asChild>
                  <Link href="https://t.me/adelazeez" target="_blank" rel="noopener noreferrer">
                    <Send className="mr-2 h-4 w-4" /> Telegram
                  </Link>
                </Button>
              </div>
            </CardContent>
            <Separator className="my-6" />
            <CardContent className="text-left space-y-4">
                <h3 className="text-2xl font-semibold">About Me</h3>
                <p className="text-muted-foreground leading-relaxed">
                    My journey into the world of technology began at the age of 17, where I taught myself HTML, CSS, JavaScript, and PHP. This early exposure sparked a deep curiosity for how systems communicate, building a strong foundation in both frontend logic and backend development. I've since built upon that foundation with a Bachelor's degree in Informatics Engineering from Tishreen University, where I specialized in Computer Networks and Systems. There, I developed a strong command of networking fundamentals—including routing, switching, and security—and brought those concepts to life by building a real-time backup system in Python for my graduation project.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    My passion lies at the intersection of development and infrastructure. I enjoy the logic of code as well as the structure of networks, which I continue to explore through a Master's program in Network Technologies. My hands-on experience ranges from simulating complex network topologies in Cisco Packet Tracer to providing direct IT support and troubleshooting at a gaming center. I am now eager to apply this unique blend of web development knowledge, programming skills, and network engineering expertise to solve real-world challenges as part of a forward-thinking team.
                </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
