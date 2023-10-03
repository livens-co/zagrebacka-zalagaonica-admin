'use client';

import { useState } from 'react';
import * as z from 'zod';
import { Blog} from '@prisma/client';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AlertModal } from '@/components/modals/alert-modal';

import ImageUpload from '@/components/ui/image-upload';
import Markdown from 'react-markdown';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  title: z.string().min(1),
  blogSlug: z.string().min(1),
  imageUrl: z.string().min(1),
  content: z.string().min(1),
});

type ArticleFormValues = z.infer<typeof formSchema>;

interface ArticleFormProps {
  initialData: Blog | null;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  

  const title = initialData ? 'Edit article' : 'Create article';
  const description = initialData ? 'Edit a article' : 'Add a new article';
  const toastMessage = initialData ? 'Article updated.' : 'Article created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: '',
      blogSlug: '',
      imageUrl: '',
      content: '',
    },
  });
 
 

  const onSubmit = async (data: ArticleFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.storeId}/blog/${params.blogSlug}`,
          data
        );
      } else {
        await axios.post(`/api/${params.storeId}/blog`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/blog`);
      toast.success(toastMessage);
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/blog/${params.blogSlug}`);
      router.refresh();
      router.push(`/${params.storeId}/blog`);
      toast.success('Article deleted.');
    } catch (error) {
      toast.error('Soemthing went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
 
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Article title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blogSlug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Article URL"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange('')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
         
             <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Article text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      {/* <div className="mt-4">
        <h2 className="text-xl font-semibold">Article Preview:</h2>
        <div className="border p-2">
          <Markdown>{form.getValues('content')}</Markdown>
        </div>
      </div> */}
    </>
  );
};
