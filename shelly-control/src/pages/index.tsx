import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  const { data } = api.shelly.getAll.useQuery()
  const { mutate } = api.shelly.postToggleDevice.useMutation({ onSuccess: (data) => console.log(data) })


  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>

          {
            data && data.devices.length ? (
              <ul className="text-2xl font-extrabold tracking-tight text-white sm:text-[5rem]">{data.devices.map((device) => (<li onClick={() => mutate({ deviceId: device.id })}>{device.name}</li>))}
              </ul>) : null
          }

        </div>
      </main>
    </>
  );
}