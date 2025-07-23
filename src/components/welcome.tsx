import { SlideInContainer } from "~/components/ui/animations/containers";
import { Logo } from "~/components/assets/logo";
import { Button } from "~/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

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
        className="flex w-full flex-col items-center justify-start px-4 py-16"
        role="main"
      >
        <div className="flex flex-col items-center justify-center gap-4">
          {/* TODO: Welcome message section */}
          {/* TODO: Features section */}
          {/* TODO: GitHub link section */}
        </div>

        <div className="flex h-full w-full flex-row items-center justify-center gap-4">
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
