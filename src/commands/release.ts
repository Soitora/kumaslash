import {
	ButtonInteraction,
	CommandInteraction,
	MessageActionRow,
	MessageButton,
} from "discord.js"
import {
	ButtonComponent,
	Discord,
	Permission,
	Slash,
	SlashChoice,
	SlashOption,
} from "discordx"
import { ARelease, Neko, Tachiyomi, TachiyomiJ2K, TachiyomiSy } from "../data/release-repository"
import { toTitleCase } from "../utils/string"
import dotenv from "dotenv"
dotenv.config()

@Discord()
abstract class ReleaseCommand {
	  
	releases = new Map<string, ARelease>()

	constructor() {
		this.releases.set("tachiyomi", new Tachiyomi())
		this.releases.set("tachiyomi-sy", new TachiyomiSy())
		this.releases.set("tachiyomi-j2k", new TachiyomiJ2K())
		this.releases.set("neko", new Neko())
	}

  @Slash("release")
  @Permission(false)
  @Permission({ id: process.env.SUPPORT_ID!, type: "ROLE", permission: true })
	async release(
    @SlashChoice("Neko", "neko")
    @SlashChoice("Tachiyomi J2K", "tachiyomi-j2k")
    @SlashChoice("Tachiyomi Sy", "tachiyomi-sy")
    @SlashChoice("Tachiyomi", "tachiyomi")
    @SlashOption("type", {
    	description: "Which version do you want to download",
    })
    	type: string,
    @SlashOption("preview", { 
    	type: "BOOLEAN", 
    	description: "Fetches preview of release if supported"
    })
    	preview: boolean,
    	interaction: CommandInteraction
	) {
		await interaction.deferReply({ ephemeral: true })
		const message = await this.releases.get(type)!.createMesseage(preview ? { preview: true } : {})
		interaction.editReply(message)
	}

  @Slash("download")
  async download(
    @SlashChoice("Neko", "neko")
    @SlashChoice("Tachiyomi J2K", "tachiyomi-j2k")
    @SlashChoice("Tachiyomi Sy", "tachiyomi-sy")
    @SlashChoice("Tachiyomi", "tachiyomi")
    @SlashOption("type", {
    	description: "Which version do you want to download",
    })
    	type: string,
    	interaction: CommandInteraction
  ) {
  	await interaction.deferReply({ ephemeral: true })

  	const onlyStableReleases = ["tachiyomi-j2k", "neko"]
  	if (onlyStableReleases.includes(type)) {
  		const message = await this.releases.get(type)!.createMesseage()
  		interaction.editReply(message)
  		return
  	}

  	interaction.editReply({
  		content: `Which version of ${toTitleCase(type.replace("-", " "))}?`,
  		components: [
  			new MessageActionRow()
  				.addComponents(
  					new MessageButton()
  						.setLabel("Stable")
  						.setStyle("PRIMARY")
  						.setEmoji("📦")
  						.setCustomId(`${type}-stable`)
  				)
  				.addComponents(
  					new MessageButton()
  						.setLabel("Preview")
  						.setStyle("PRIMARY")
  						.setEmoji("🔥")
  						.setCustomId(`${type}-preview`)
  				)
  		],
  	})
  }

  @ButtonComponent("tachiyomi-stable")
  async tachiyomiStable(interaction: ButtonInteraction) {
  	const message = await this.releases.get("tachiyomi")!.createMesseage()
  	interaction.reply(message)
  }

  @ButtonComponent("tachiyomi-preview")
  async tachiyomiPreview(interaction: ButtonInteraction) {
  	const message = await this.releases.get("tachiyomi")!.createMesseage({ preview: true })
  	interaction.reply(message)
  }

  @ButtonComponent("tachiyomi-sy-stable")
  async tachiyomiSyStable(interaction: ButtonInteraction) {
  	const message = await this.releases.get("tachiyomi-sy")!.createMesseage()
  	interaction.reply(message)
  }

  @ButtonComponent("tachiyomi-sy-preview")
  async tachiyomiSyPreview(interaction: ButtonInteraction) {
  	const message = await this.releases.get("tachiyomi-sy")!.createMesseage({ preview: true })
  	interaction.reply(message)
  }
}
