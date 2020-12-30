import { formatError } from 'graphql'
import mongoose from 'mongoose'
import Set from '../models/Set.js'
import { dqPing, callPlayers } from '../commands/dqping.js'
import playerCheckin from '../commands/setcheckin.js'
import { sendReminder } from '../utils/message_helper.js'

export default sendReminder