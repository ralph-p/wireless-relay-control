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
    .input(z.object({ deviceId: z.string(), turn: z.string(), channel: z.number() }))
    .mutation(async ({ input }) => {
      const authKey = process.env.NEXT_SHELLY_AUTH_KEY || null
      if (url && authKey) {
        let apiUrl = `${url}/device/relay/control/`
        const requestData = {
          auth_key: authKey,
          channel: input.channel,
          turn: input.turn,
          id: input.deviceId,
        }
        // Include the authentication key in the request headers
        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
        };
        try {
          const response = await axios.post(apiUrl, requestData, { headers });

          if (response.status === 200) {
            return response.data;
          } else {
            throw new Error('Failed to control relay.');
          }
        } catch (error) {
          throw new Error('Failed to control relay.');
        }
      }

    }),
});
