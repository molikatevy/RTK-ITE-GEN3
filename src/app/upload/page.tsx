// app/upload/page.tsx
import { BasicFileUpload } from "@/components/FileUpload/BasicFileUpload";
import { DropzoneFileUpload } from "@/components/FileUpload/DropzoneFileUpload";
import { UploadWithHook } from "@/components/FileUpload/UploadWithHook";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">File Upload</h1>
        
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="dropzone">Dropzone</TabsTrigger>
            <TabsTrigger value="hook">With Hook</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <BasicFileUpload />
          </TabsContent>
          
          <TabsContent value="dropzone">
            <DropzoneFileUpload />
          </TabsContent>
          
          <TabsContent value="hook">
            <UploadWithHook />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}