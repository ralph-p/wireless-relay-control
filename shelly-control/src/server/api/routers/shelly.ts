import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import queryString from 'query-string';

const url = process.env.NEXT_SHELLY_CONTROL_CLOUD_URL || null
export const shellyRouter = createTRPCRouter({
  getDeviceInfo: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .mutation(async ({ input }) => {
      const authKey = process.env.NEXT_SHELLY_AUTH_KEY || null
      if (url && authKey) {
        const postUrl = `${url}/device/status?auth_key=${authKey}&id=${input.deviceId}`
        const post = await axios.post(postUrl)
        return post.data
      }

    }),
  getAll: publicProcedure.query(() => {
    return { devices: [{ name: "Relay 1", id: "ec62609151a0" }] }
  }),
  postToggleDevice: publicProcedure
    .input(z.object({ deviceId: z.string() }))
    .mutation(async ({ input }) => {
      const authKey = process.env.NEXT_SHELLY_AUTH_KEY || null
      if (url && authKey) {
        let postUrl = `${url}/device/status?auth_key=${authKey}&id=${input.deviceId}`
        const { data } = await axios.post(postUrl)
        if (data.isok) {
          postUrl = `${url}/device/relay/control/`
          const formData = new FormData()
          formData.append('auth_key', authKey)
          formData.append('id', input.deviceId)
          formData.append('turn', 'off')
          formData.append('channel', '1')

          await axios.post(postUrl, queryString.stringify({ auth_key: authKey, id: input.deviceId, turn: "off", channel: 1 }), { headers: { 'Content-Type': 'multipart/form-data' } })


        }
      }

    }),
});
