import ButtonComponent from "@/components/ui/ButtonComponent";
import GetCountComponent from "@/components/ui/GetCountComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";


export default function Home() {
  return (

    <div>
      <ButtonComponent />
      <GetCountComponent />
    </div>
  )
  //  <Card className="max-w-sm">
  //       <CardHeader>
  //         <CardTitle>Project Overview</CardTitle>
  //         <CardDescription>
  //           Track progress and recent activity for your Next.js app.
  //         </CardDescription>
  //       </CardHeader>
  //       <CardContent>
  //         Your design system is ready. Start building your next component.
  //       </CardContent>
  //     </Card>
  //   );
}
