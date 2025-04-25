"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FormSchema = z.object({
  roadmap: z.string({
    required_error: "Please select an roadmap to display.",
  }),
});

export function SelectRoad() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const selected = data.roadmap;

    toast.success(`Redirecting to ${selected} roadmap...`);
    router.push(`/roadmap/${selected}`);
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-2xl space-y-6"
      >
        <FormField
          control={form.control}
          name="roadmap"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose your roadmap</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a roadmap to explore" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  <SelectItem value="frontend">Frontend Developer</SelectItem>
                  <SelectItem value="backend">Backend Developer</SelectItem>
                  <SelectItem value="ai-engineer">AI Engineer</SelectItem>
                  <SelectItem value="cyber-security">Cyber Security</SelectItem>
                  <SelectItem value="data-analyst">Data Analyst</SelectItem>
                  <SelectItem value="full-stack">
                    Full Stack Engineer
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can customize your learning in your{" "}
                <Link href="/roadmap">dashboard</Link>.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Generate Roadmap</Button>
      </form>
    </Form>
  );
}
