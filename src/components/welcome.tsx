import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import {
  SlideInContainer,
  StaggerContainer,
} from "~/components/ui/animations/containers";
import { Logo } from "~/components/assets/logo";
import { Github } from "~/components/assets/github";
import Link from "next/link";

export async function Welcome() {
  return (
    <>
      <div className="from-muted to-background w-screen bg-linear-to-b">
        <div className="min-h-14" />
        <div className="flex h-full w-full max-w-screen flex-row flex-wrap items-baseline p-8 text-start md:p-16">
          <SlideInContainer
            className="flex flex-row items-center gap-2"
            direction="right"
            delay={0.2}
          >
            <Logo className="size-18" />
            <h1 className="me-6 text-8xl leading-none font-bold tracking-tight">
              Pouch
            </h1>
          </SlideInContainer>
          <SlideInContainer direction="right" delay={0.3}>
            <h2 className="flex flex-row items-baseline text-3xl leading-none font-bold tracking-normal text-nowrap">
              Store your favorite things
            </h2>
          </SlideInContainer>
        </div>
      </div>

      <main
        className="flex w-full flex-col items-center justify-start gap-16 px-4 py-24"
        role="main"
      >
        <StaggerContainer className="flex flex-col items-center justify-center gap-12">
          {/* Welcome message section */}
          <div className="flex max-w-2xl flex-col gap-4">
            <p className="text-foreground text-center text-3xl font-bold">
              Pouch is a modern web application for organizing and storing your
              favorite things.
            </p>
          </div>
          <div className="flex max-w-xl flex-col gap-4">
            <p className="text-foreground text-center text-xl">
              Sortable lists and notepads inside groups, automatically
              synchronized across your devices.
            </p>
            <p className="text-foreground text-center text-xl">
              Pouch is designed for speed, reliability, and ease of use.
            </p>
          </div>

          {/* Features section */}
          <div className="mt-24 flex w-full max-w-4xl flex-col gap-8">
            <h3 className="text-center text-4xl font-semibold">Features</h3>
            <div className="mx-auto grid grid-cols-1 gap-8 text-left text-lg md:grid-cols-2">
              <div className="flex flex-1 flex-col gap-2">
                <h4 className="text-3xl font-semibold">Groups</h4>
                <p>
                  Organize your lists and notepads into groups, each with a name
                  and description.
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <h4 className="text-3xl font-semibold">Lists</h4>
                <p>
                  Add, edit, delete, and reorder text or URL items within
                  groups. Drag-and-drop supported.
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <h4 className="text-3xl font-semibold">Notepads</h4>
                <p>
                  Each group has a collaborative notepad for freeform notes,
                  with real-time syncing and live updates.
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <h4 className="text-3xl font-semibold">Open Source</h4>
                <p>
                  Pouch is fully open source under the Apache 2.0 license. You
                  can view the source code on GitHub.
                </p>
              </div>
            </div>
          </div>

          {/* GitHub link section */}
          <div className="mt-4 flex flex-col items-center">
            <Link
              aria-label="View Pouch on GitHub"
              href="https://github.com/timmo001/pouch"
              target="_blank"
              rel="noopener noreferrer"
              passHref
            >
              <Button
                className="h-fit w-fit gap-3 px-4 py-2 text-lg font-medium transition-colors"
                variant="outline"
                size="lg"
              >
                <Github className="size-6 fill-current" />
                <span>View on GitHub</span>
              </Button>
            </Link>
          </div>
        </StaggerContainer>

        <div className="mt-32 flex w-full flex-col gap-8">
          <h3 className="text-center text-4xl font-semibold">
            Ready to get started?
          </h3>
        </div>

        <div className="mt-32 mb-48 flex h-full w-full flex-row items-center justify-center gap-4">
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <p className="text-center text-2xl font-bold lg:text-4xl">
              Sign in to continue
            </p>
            <Button size="lg" variant="default" asChild>
              <SignInButton mode="modal" />
            </Button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2">
            <p className="text-center text-2xl font-bold lg:text-4xl">
              New here?
            </p>
            <Button size="lg" variant="default" asChild>
              <SignUpButton mode="modal" />
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
