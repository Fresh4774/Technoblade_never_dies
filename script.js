const internalState = {
    parallax: 0,
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    minRotX: -60,
    maxRotX: 60,
    minRotY: -180,
    maxRotY: 180,
}
const state = {};

function activateCamera() {
    const camera = document.querySelector(".globalCamera");

    Object.defineProperty(state, "parallax", {
        get() {
            return internalState.parallax;
        },
        set(data) {
            if (data) {
                internalState.parallax = true;
            } else {
                internalState.parallax = false;
                camera.style.removeProperty("transform");
            }
            return internalState.parallax;
        }
    });

    const CONSTRAINT_KEYWORDS = ["minRotX", "maxRotX", "minRotY", "maxRotY"];
    for (let keyword of CONSTRAINT_KEYWORDS) {
        Object.defineProperty(state, keyword, {
            get() {
                return internalState[keyword];
            },
            set(data) {
                if (typeof data !== "number" || isNaN(data)) {
                    throw new Error("Minimum and maximum must be a number");
                }
                internalState[keyword] = data;
            }
        })
    }

    window.addEventListener("mousemove", function (e) {
        if (state.parallax) {
            const {minRotX, maxRotX, minRotY, maxRotY} = internalState;
            const {clientX, clientY} = e;
            const percentageX = clientX / internalState.innerWidth;
            const percentageY = clientY / internalState.innerHeight;
            const rotX = -(minRotX + (maxRotX - minRotX) * percentageY);
            const rotY = minRotY + (maxRotY - minRotY) * percentageX;
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    camera.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
                })
            });
        }
    });

    window.addEventListener("resize", function () {
        internalState.innerWidth = window.innerWidth;
        internalState.innerHeight = window.innerHeight;
    });
}

function toggleParallax() {
    state.parallax = !state.parallax;
}

activateCamera();
toggleParallax();