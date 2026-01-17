import useWorkspaceStore from '@/store/workspace-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import * as z from 'zod';

import { BASE_MODEL_TYPE } from '@/types/base';
import { WORKSPACE_TYPE, type Workspace } from '@/types/workspace';
import { Button } from '@/components/common/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/common/card';
import { Field, FieldError, FieldLabel } from '@/components/common/field';
import { Input } from '@/components/common/input';
import { Label } from '@/components/common/label';
import { RadioGroup, RadioGroupItem } from '@/components/common/radio-group';
import { WorkspaceTypeIcon } from '@/components/icon/workspace-type-icon';

const formSchema = z.object({
  name: z.string().min(1, 'Workspace name is required'),
  description: z.string().optional(),
  type: z.enum([WORKSPACE_TYPE.PUBLIC, WORKSPACE_TYPE.INTERNAL]),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateWorkspaceView() {
  const navigate = useNavigate();
  const { createWorkspace, setActiveWorkspace } = useWorkspaceStore();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      type: WORKSPACE_TYPE.INTERNAL,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const workspace: Workspace = {
        id: nanoid(),
        modelType: BASE_MODEL_TYPE.WORKSPACE,
        name: values.name,
        type: values.type,
        description: values.description || null,
      };

      await createWorkspace(workspace);
      await setActiveWorkspace(workspace.id);

      toast.success('Workspace created successfully');
      navigate('/main/workspace/' + workspace.id);
    } catch (error) {
      console.error('Failed to create workspace:', error);
      toast.error('Failed to create workspace');
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-6 bg-background overflow-y-auto animate-in zoom-in-95 duration-300">
      <div className="w-full max-w-2xl">
        <Button variant="ghost" size="sm" className="mb-4 px-0" onClick={() => navigate('/home')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Workspaces
        </Button>

        <Card className="shadow-lg border-muted/50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create Workspace</CardTitle>
            <CardDescription>
              A workspace helps you organize your collections, environments, and team members.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Name</FieldLabel>
                    <Input {...field} placeholder="e.g. My Project, API Testing" autoComplete="off" />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Type</FieldLabel>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"
                    >
                      <Label
                        htmlFor="internal"
                        className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                      >
                        <RadioGroupItem value={WORKSPACE_TYPE.INTERNAL} id="internal" />
                        <div className="grid gap-1.5 leading-none">
                          <div className="flex items-center gap-2 font-semibold">
                            <WorkspaceTypeIcon workspaceType={WORKSPACE_TYPE.INTERNAL} size={14} />
                            Internal
                          </div>
                          <p className="text-xs text-muted-foreground">Only visible to you and members you invite.</p>
                        </div>
                      </Label>
                      <Label
                        htmlFor="public"
                        className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/5"
                      >
                        <RadioGroupItem value={WORKSPACE_TYPE.PUBLIC} id="public" />
                        <div className="grid gap-1.5 leading-none">
                          <div className="flex items-center gap-2 font-semibold">
                            <WorkspaceTypeIcon workspaceType={WORKSPACE_TYPE.PUBLIC} size={14} />
                            Public
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Visible to everyone. Use for open-source or public APIs.
                          </p>
                        </div>
                      </Label>
                    </RadioGroup>
                  </Field>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-end gap-3 pt-6 ">
              <Button type="button" variant="outline" onClick={() => navigate('/home')} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Loading...' : 'Create Workspace'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
