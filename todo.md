- update hero section
- add config filters in blog page?

enhance

the edit article button in recordclient > actionbar.tsx component makes blog editable using MDEditor component which comes from uiw/react-md-editor. when trying to change text, the location of input differs from original chaning place. fix it. it might the font size, or inner editor issue. for example, if i want to change line 1, and click with mouse to line one, the editing slash appears in the start of the lime

the following component allows to share the blog immediately in the social networks

const ShareLinks: FC<Props> = ({ postTitle }) => {
const currentUrl = typeof window !== "undefined" ? window.location.href : ""

const encodedUrl = encodeURIComponent(currentUrl)
const encodedTitle = encodeURIComponent(postTitle)

const shareUrls: Record<LinkType, string> = {
twitter: `https://x.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`,
facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
}

const handleShare = (platform: LinkType) => {
window.open(shareUrls[platform], "\_blank", "noopener,noreferrer,width=600,height=400")
}

const handleCopy = async () => {
await copyToClipboard(currentUrl)
}

return (
<div className="flex items-center gap-3">
<span className="text-lg leading-6">Share:</span>
<div className="flex items-center gap-1.5">
{SHARE_ICONS.map(({ Icon, social, title, role }) =>
role === "link" ? (
<button onClick={() => handleShare(social)} title={title} key={title}>
<Icon className="h-10 w-10" />
</button>
) : (
<button
              type="button"
              title={title}
              key={title}
              onClick={handleCopy}
              className="cursor-pointer border-0 bg-transparent p-0 transition focus:fill-emerald-700"
            >
<Icon className="fill-inherit" />
</button>
),
)}
</div>
</div>
)
}
export default ShareLinks

const SHARE_ICONS = [
{
Icon: TwitterIcon,
title: "Share on Twitter",
role: "link",
social: "twitter" as LinkType,
href: siteConfig.twitter,
},
{
Icon: LinkedInBlackIcon,
title: "Share on LinkedIn",
role: "link",
social: "linkedin" as LinkType,
href: siteConfig.linkedIn,
},
{
Icon: FacebookIcon,
title: "Share on Facebook",
role: "link",
social: "facebook" as LinkType,
href: siteConfig.facebook,
},
{
Icon: CopyLinkIcon,
title: "Copy Link",
type: "button",
},
]

add the similar logic inside ActionBar component. change the copy mdx logic to button in which when user clicks, the copy mdx, or one of the share social links appear to choose
